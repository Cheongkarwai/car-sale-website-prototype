import {Component, OnDestroy} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {UploadFileComponent} from "../../../../core/component/upload-file/upload-file.component";
import {CarService} from "../../../../core/service/car.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../../../core/component/confirmation-dialog/confirmation-dialog.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {concatMap, from, lastValueFrom, mergeMap, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {CarDetails} from "../../../../core/model/car-details.interface";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment.development";
import {FileService} from "../../../../core/service/file.service";

@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    UploadFileComponent,
    RouterLink
  ],
  templateUrl: './edit-car.component.html',
  styleUrl: './edit-car.component.css'
})
export class EditCarComponent implements OnDestroy {

  carForm!: FormGroup;
  car$ = new Observable<CarDetails | null>();
  currentId!: number;
  private destroy$ = new Subject();
  isSubmitButtonLoading = false;

  constructor(private fb: FormBuilder, private carService: CarService,
              private dialog: MatDialog, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
              private http: HttpClient, private fileService: FileService) {

    this.carForm = this.fb.group({
      brand: ['Volvo', Validators.required],
      price: [0, Validators.required],
      model: ['', Validators.required],
      condition: ['NEW', Validators.required],
      milleage: [{disabled: true, value: 0}, Validators.required],
      features: this.fb.array([this.createFeatureFormArray()]),
      car_model_image: [null, Validators.required],
      exterior_images: [[], Validators.required],
      interior_images: [[], Validators.required],
      brochure_pdf: [null, Validators.required]
    });

    activatedRoute.params.subscribe(param => {
      this.currentId = param['id'];
      this.findCarById(this.currentId);
      this.car$.pipe(takeUntil(this.destroy$)).subscribe(res => {

        res?.features.forEach((feature, index) => {
          this.featureFormArray.at(index).get('title')?.setValue(feature.title);
          this.featureFormArray.at(index).get('description')?.setValue(feature.description);
          this.loadImage(feature.image, index, 'feature_image').subscribe(featureFile => {
            this.featureFormArray.at(index).get('image')?.setValue(featureFile);
          });
        });

        res?.exterior_images.forEach((exteriorImage, index) => {
          this.loadImage(exteriorImage.path, index, 'exterior_image')
            .subscribe(exteriorFile => this.carForm.controls['exterior_images'].setValue([...this.carForm.controls['exterior_images'].getRawValue(), exteriorFile]));
        })

        res?.interior_images.forEach((exteriorImage, index) => {
          this.loadImage(exteriorImage.path, index, 'interior_image')
            .subscribe(exteriorFile => this.carForm.controls['interior_images'].setValue([...this.carForm.controls['interior_images'].getRawValue(), exteriorFile]));
        })

        this.carForm.patchValue({
          brand: res?.brand,
          price: res?.starting_price,
          model: res?.model,
          condition: res?.condition,
          milleage: res?.milleage,
        });

        if (res?.condition === 'USED') {
          this.carForm.controls['milleage'].enable();
        }

        this.loadBrochurePdf(res?.brochure_pdf as string);
        this.loadCarModelImage(res?.model_image as string);
      });
    });

  }

  loadImage(imageUrl: string, index: number, filename: string) {
    return this.fileService.loadFileFromUrl(imageUrl, `${filename}-${index}`);
  }

  loadBrochurePdf(brochurePdfUrl: string) {
    this.fileService.loadFileFromUrl(brochurePdfUrl, 'brochure_pdf')
      .subscribe(res => {
        this.carForm.controls['brochure_pdf'].setValue(res);
      });
  }

  loadCarModelImage(modelImageUrl: string) {
    this.fileService.loadFileFromUrl(modelImageUrl, 'image_model')
      .subscribe(res => {
        this.carForm.controls['car_model_image'].setValue(res);
      });
  }

  findCarById(id: number) {
    this.carService.findCarDetailsById(id);
    this.car$ = this.carService.getCarDetails$();
  }

  ngOnInit(): void {
    console.log(this.modelImage.getRawValue());

  }

  createFeatureFormArray() {
    return this.fb.group({
      description: ['', Validators.required],
      title: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  get featureFormArrayControls() {
    return (this.carForm.get('features') as FormArray).controls;
  }

  get featureFormArray() {
    return this.carForm.get('features') as FormArray;
  }

  addNewFeature() {
    const featureFormArray = this.featureFormArray;
    featureFormArray.push(this.createFeatureFormArray());
  }

  submitForm(event: SubmitEvent) {
    if (this.carForm.invalid && this.featureFormArray.invalid) {
      this.snackBar.open('Please fill in the required fields', 'Close', {duration: 1000});
    } else {
      this.isSubmitButtonLoading = true;

      const dialog = this.openConfirmationDialog("Update car", `Are you sure you want to update?`);
      dialog.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.carService.edit(this.currentId, this.carForm.getRawValue())
            .subscribe({
              next: res => {
                this.snackBar.open('Success', 'Close', {duration: 1000});
                window.location.reload();
                this.isSubmitButtonLoading = false;
              },
              error: err => {
                this.snackBar.open('Failed', 'Close', {duration: 1000});
                this.isSubmitButtonLoading = false;
              }
            })
        }
      });
    }

  }

  openConfirmationDialog(title: string, message: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel(title, message)
    });
  }

  removeLastFeature() {
    const featureFormArray = this.featureFormArray;
    featureFormArray.removeAt(featureFormArray.length - 1);
  }


  onSelectCondition(event: MatSelectChange) {
    switch (event.value) {
      case 'USED':
        this.carForm.controls['features'].disable();
        this.carForm.controls['car_model_image'].disable();
        this.carForm.controls['exterior_images'].disable();
        this.carForm.controls['interior_images'].disable();
        this.carForm.controls['brochure_pdf'].disable();
        this.carForm.controls['milleage'].enable();
        break;
      case 'NEW':
        this.carForm.controls['features'].enable();
        this.carForm.controls['car_model_image'].enable();
        this.carForm.controls['exterior_images'].enable();
        this.carForm.controls['interior_images'].enable();
        this.carForm.controls['brochure_pdf'].enable();
        this.carForm.controls['milleage'].disable();
        break;
    }
  }

  get modelImage() {
    return this.carForm.get('car_model_image') as FormControl;
  }

  get brochurePdf() {
    return this.carForm.get('brochure_pdf') as FormControl;
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }


  featureImage(i: number) {
    return this.featureFormArray.at(i).get('image') as FormControl;
  }

  get exteriorImages() {
    return this.carForm.controls['exterior_images'] as FormControl;
  }

  get interiorImages() {
    return this.carForm.controls['interior_images'] as FormControl;
  }
}
