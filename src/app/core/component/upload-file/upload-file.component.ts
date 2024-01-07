import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
  standalone:true,
  imports: [CommonModule, MatIconModule,MatButtonModule]
})
export class UploadFileComponent implements OnInit {

  files:File [] = [];

  @Input('format') accept!:string;

  isUploading:boolean = false;

  @Input('multiple')  isMultipleUpload!:boolean;
  @Output("uploadFile") uploadFile = new EventEmitter<File[]>();
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

    for(let file of files){
      this.files.push(file);
    }
  }

  uploadFiles(){

    this.uploadFile.emit(this.files);
  }

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
    this.files.splice(i,1);
    this.uploadFile.emit(this.files);
  }


  selectFile(event:any) {
    if(event.target.files.length > 0){
      this.files = [];
      this.files.push(event.target.files[0]);
      this.uploadFile.emit(this.files);
    }else{
      this.files = [];
      this.uploadFile.emit(this.files);
    }
  }


  async selectFiles(event: any) {
    if(event.target.files.length > 0){
      const files:FileList = event.target.files;
      await this.waitUploadingAnimation();
      for(let i = 0;i < files.length; i++){
        this.files.push(files.item(i) as File);
      }
      this.uploadFile.emit(this.files);
    }
  }
}
