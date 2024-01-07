import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {MatSortModule, Sort} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  @Input() data: any;
  // @ts-ignore
  @Input() columns: any[];
  @Input() enableDelete = false;
  @Input() enableEdit = false;
  @Input() enableCancel = false;
  @Input() enableComplete = false;

  displayedColumns: string[] = [];

  @Output() sort = new EventEmitter<Sort>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() complete = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(column => column.key);
  }

  handleSort(event: Sort) {
    event.active = event.active
      .split("_")
      .reduce(
        (res, word, i) =>
          i === 0
            ? word.toLowerCase()
            : `${res}${word.charAt(0).toUpperCase()}${word
              .substr(1)
              .toLowerCase()}`,
        ""
      );
    this.sort.emit(event);
  }

  handleEdit(event:any){
    this.edit.emit(event);
  }

  handleDelete(event:any){
    console.log(event);
    this.delete.emit(event);
  }

  handleCancel(event:any){
    this.cancel.emit(event);
  }
  handleComplete(event:any){
    this.complete.emit(event);
  }
}
