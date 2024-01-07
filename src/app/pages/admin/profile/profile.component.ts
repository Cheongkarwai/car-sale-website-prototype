import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {AccountService} from "../../../core/service/account.service";
import {Observable, Subject, takeUntil, takeWhile} from "rxjs";
import {Account} from "../../../core/model/account.interface";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/service/auth.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit ,OnDestroy{

  accountForm!:FormGroup;

  account$!:Observable<Account>;

  observableAlive:boolean = true;
  constructor(private fb:FormBuilder,private accountService:AccountService,
              private router:Router,private authService:AuthService) {
  }

  ngOnInit(){
    this.accountForm = this.fb.group({
      username:[{value:'',disabled:true}],
      contact_number:[{value:'',disabled:true}],
      full_name:[{value:'',disabled:true}],
      password:[{value:'',disabled:true}]
    });


    const username = localStorage.getItem('username') || '';

    if(!username){
      this.router.navigateByUrl('/login')
        .then(res=>this.authService.logout());
    }
      this.findAccountByUsername(username);
      this.account$.pipe(takeWhile(()=>this.observableAlive)).subscribe(account=>{
        this.accountForm.patchValue({
          username:account?.username,
          full_name:account?.full_name,
          contact_number:account?.contact_number,
          password:'123123123'
        })
      })

  }

  findAccountByUsername(username:string){
    this.accountService.findById(username);
    this.account$ = this.accountService.getAccount$();
  }

  ngOnDestroy() {
    this.observableAlive = false;
  }
}
