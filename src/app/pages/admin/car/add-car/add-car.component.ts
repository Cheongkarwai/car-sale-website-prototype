import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {UploadFileComponent} from "../../../../core/component/upload-file/upload-file.component";
import {CarService} from "../../../../core/service/car.service";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../../../core/component/confirmation-dialog/confirmation-dialog.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatSnackBarModule,
    UploadFileComponent, MatSelectModule],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css'
})
export class AddCarComponent implements OnInit{

  addNewCarForm!:FormGroup;
  constructor(private fb:FormBuilder,private carService:CarService,
              private dialog:MatDialog,private snackBar:MatSnackBar){}

  ngOnInit(): void {
    this.addNewCarForm = this.fb.group({
      brand:['Volvo',Validators.required],
      price:[0,Validators.required],
      model:['',Validators.required],
      condition:['',Validators.required],
      milleage:[{disabled:true,value:0},Validators.required],
      features:this.fb.array([this.createFeatureFormArray()]),
      car_model_image:[null,Validators.required],
      exterior_images:[[],Validators.required],
      interior_images:[[],Validators.required],
      brochure_pdf:[null,Validators.required]
    });

  }

  createFeatureFormArray(){
    return this.fb.group({
      category:['',Validators.required],
      description:['',Validators.required],
      title:['',Validators.required],
      image:[null,Validators.required],
    });
  }

  get featureFormArrayControls(){
    return (this.addNewCarForm.get('features') as FormArray).controls;
  }

  get featureFormArray(){
    return this.addNewCarForm.get('features') as FormArray;
  }

  addNewFeature(){
    const featureFormArray = this.featureFormArray;
    featureFormArray.push(this.createFeatureFormArray());
  }

  submitForm(event:SubmitEvent){
    console.log("New Car form is invalid "+this.addNewCarForm.invalid);
    console.log("Feature Form Array is invalid "+this.featureFormArray.invalid);

    if(this.addNewCarForm.invalid && this.featureFormArray.invalid){
      this.snackBar.open('Please fill in the required fields','Close',{duration:1000});

    }else{
      switch(this.addNewCarForm.controls['condition'].getRawValue()){
        case 'USED':
          console.log(this.addNewCarForm.getRawValue());
          const dialog = this.openConfirmationDialog("Create used car", `Are you sure you want to create?`);
          dialog.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
              this.carService.saveUsedCar(this.addNewCarForm.getRawValue())
                .subscribe({
                  next:res=>{
                    this.snackBar.open('Success','Close',{duration:1000});
                    window.location.reload();
                  },
                  error:err=>this.snackBar.open('Failed', 'Close',{duration:1000})
                })
            }
          });
          break;
        case  'NEW':

          const dialogRef = this.openConfirmationDialog("Create new car", `Are you sure you want to create?`);
          dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
              this.carService.saveNewCar(this.addNewCarForm.getRawValue())
                .subscribe({
                  next:res=>{
                    this.snackBar.open('Success','Close',{duration:1000});
                    window.location.reload();
                  },
                  error:err=>this.snackBar.open('Failed', 'Close',{duration:1000})
                })
            }
          });
          break;
      }
    }

    let isImageFormControlInvalid = false;

    // switch(this.addNewCarForm.controls['condition'].getRawValue()){
    //   case 'USED':
    //     if(!this.addNewCarForm.controls['car_model_image'].getRawValue()){
    //       isImageFormControlInvalid = true;
    //     }
    //
    //     break;
    //
    //   case 'NEW':
    //
    //     if(!this.addNewCarForm.controls['car_model_image'].getRawValue() || !this.addNewCarForm.controls['exterior_images'].getRawValue() ||
    //       !this.addNewCarForm.controls['interior_images'].getRawValue() || !this.addNewCarForm.controls['brochure_pdf'].getRawValue()
    //     || this.featureFormArray.invalid){
    //       isImageFormControlInvalid = true;
    //     }
    //
    //     break;
    //
    // }

    // if(!this.addNewCarForm.invalid){
    //   const dialogRef = this.openConfirmationDialog("Create new car", `Are you sure you want to create?`);
    //   dialogRef.afterClosed().subscribe(dialogResult => {
    //     if (dialogResult) {
    //       this.carService.saveNewCar(this.addNewCarForm.getRawValue())
    //         .subscribe({
    //           next:res=>this.snackBar.open('Success','Close',{duration:1000}),
    //           error:err=>this.snackBar.open('Failed', 'Close',{duration:1000})
    //         })
    //     }
    //   });
    // }else{
    //   this.snackBar.open('Please fill in the required fields','Close',{duration:1000});
    // }

  }

  openConfirmationDialog(title:string,message:string){
   return  this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel(title, message)
    });
  }

  removeLastFeature() {
    const featureFormArray =  this.featureFormArray;
    featureFormArray.removeAt(featureFormArray.length-1);
  }


  uploadCarModelImage(files:File[]){
    this.addNewCarForm.controls['car_model_image'].setValue(files[0]);
  }

  uploadInteriorImages(files:File[]){
    this.addNewCarForm.get('interior_images')?.setValue(files);
  }
  uploadFeatureImage(files:File[],index:number){
    const featureFormArray = this.featureFormArray;
    featureFormArray.at(index).get('image')?.setValue(files[0]);
    console.log(files);
  }

  uploadCarBrochure(files: File[]) {
    this.addNewCarForm.get('brochure_pdf')?.setValue(files[0]);
  }

  uploadExteriorImages(files: File[]) {
    console.log(files);
    this.addNewCarForm.get('exterior_images')?.setValue(files);
  }


  onSelectCondition(event: MatSelectChange) {
      switch (event.value){
        case 'USED':
          this.addNewCarForm.controls['features'].disable();
          this.addNewCarForm.controls['car_model_image'].disable();
          this.addNewCarForm.controls['exterior_images'].disable();
          this.addNewCarForm.controls['interior_images'].disable();
          this.addNewCarForm.controls['brochure_pdf'].disable();
          this.addNewCarForm.controls['milleage'].enable();
          break;
        case 'NEW':
          this.addNewCarForm.controls['features'].enable();
          this.addNewCarForm.controls['car_model_image'].enable();
          this.addNewCarForm.controls['exterior_images'].enable();
          this.addNewCarForm.controls['interior_images'].enable();
          this.addNewCarForm.controls['brochure_pdf'].enable();
          this.addNewCarForm.controls['milleage'].disable();
          break;
      }
  }
}
