import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
  standalone:true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule]
})
export class UploadFileComponent implements OnInit {

  // files:File [] = [];

  @Input('format') accept!:string;
  @Input() control!:FormControl;

  isUploading:boolean = false;

  @Input('multiple')  isMultipleUpload!:boolean;
  // @Output("uploadFile") uploadFile = new EventEmitter<File[]>();
  constructor() { }

  ngOnInit(): void {
  }

  async onDrop(event:any){
     event.stopPropagation();
     event.preventDefault();

     this.addFile(event.dataTransfer.files);
     await this.waitUploadingAnimation();

  }

  async waitUploadingAnimation(){
    this.turnOnUploadAnimation();
    await this.wait(3000);
    this.turnOffUploadAnimation();
  }

  addFile(files:File[]){
    const formFiles = this.control.getRawValue() as File[];

    for(let file of formFiles){
      formFiles.push(file);
    }
    this.control.setValue(formFiles);
  }

  // uploadFiles(){
  //
  //   this.uploadFile.emit(this.files);
  // }

  wait(ms:number){
    return new Promise(resolve=>
      setTimeout(resolve
      , ms)
    );
  }

  turnOnUploadAnimation(){
    this.isUploading = true;
  }

  turnOffUploadAnimation(){
    this.isUploading = false;
  }

  onDragLeave(event:any){
  }

  onDragOver(event:any){
    event.preventDefault();
  }

  removeFile(i:number) {
    const files = this.control.getRawValue() as File[];
    files.splice(i,1);
    this.control.setValue(files);
    // this.files.splice(i,1);
    // this.uploadFile.emit(this.files);
  }

  removeSingleFile(){
    this.control.reset();
  }


  selectFile(event:any) {
    // if(event.target.files.length > 0){
    //   this.files = [];
    //   this.files.push(event.target.files[0]);
    //   this.uploadFile.emit(this.files);
    // }else{
    //   this.files = [];
    //   this.uploadFile.emit(this.files);
    // }
    this.control.setValue(event.target.files[0]);
  }


  async selectFiles(event: any) {
    if(event.target.files.length > 0){
      const files:FileList = event.target.files;
      await this.waitUploadingAnimation();
      const formFiles = this.control.getRawValue();
      for(let i = 0;i < files.length; i++){
        formFiles.push(files.item(i) as File);
      }
      this.control.setValue(formFiles)
    }
  }
}
