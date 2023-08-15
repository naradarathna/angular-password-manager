import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

import { AES, enc } from 'crypto-js';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css']
})
export class PasswordListComponent {
  siteId !: string;
  siteName !: string;
  siteUrl !: string;
  siteImgUrl !: string;

  passwordId !: string;
  email !: string;
  username !: string;
  password !: string;

  formState : string = "Add New";
  isSuccess: boolean = false;
  message: string = "";

  passwordList !: Array<any>;

  constructor( private route: ActivatedRoute, private passwordManagerService: PasswordManagerService){
    this.route.queryParams.subscribe((val:any)=>{
      this.siteId = val.id;
      this.siteName = val.siteName;
      this.siteUrl = val.siteUrl;
      this.siteImgUrl = val.siteImgUrl;
    })
    this.loadPassword();
  }

  onSubmit(value: any){
    const encryptedPassword = this.encryptPassword(value.password);
    value.password = encryptedPassword;

    if(this.formState == "Add New"){
      this.passwordManagerService.addPassword(value, this.siteId)
      .then(()=>{
        this.restForm();
        console.log("Password Saved");
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else if(this.formState == "Edit"){
      this.passwordManagerService.updatePassword(this.passwordId, this.siteId, value)
      .then(()=>{
        this.restForm();
        console.log("Password Updated");
      })
      .catch(err=>{
        console.log(err);
      })
    }
    
  }

  restForm(){
    this.email = "";
    this.username = "";
    this.password = "";
    this.formState = "Add New";
    this.passwordId = "";

  }

  loadPassword(){
    this.passwordManagerService.loadPasswords(this.siteId).subscribe(val=> {
      this.passwordList = val;
    })
  }

  editPassword(id: string, email: string, username: string, password: string){
    this.formState = "Edit";
    this.email = email;
    this.username = username;
    this.password = password;
    this.passwordId = id;
  }

  deletePassword(id:string) {
    this.passwordManagerService.deletePassword(id, this.siteId).then(()=>{
      this.isSuccess = true;
      this.message = "Deleted site successfully";
    }).catch(err => {
      this.message = err;
    })
  }

  encryptPassword(password:string){
    const secretKey = 'CfO,P7ps;;K$!L%FJ#a+6ruxE=Lt+SR5';
    const encryptedPassword = AES.encrypt(password, secretKey).toString();
    return encryptedPassword;
  }

  decryptPassword(password:string){
    const secretKey = 'CfO,P7ps;;K$!L%FJ#a+6ruxE=Lt+SR5';
    const decryptedPassword = AES.decrypt(password, secretKey).toString(enc.Utf8);
    return decryptedPassword;
  }

  onDecrypt(password:string, index: number){
    const decPassword = this.decryptPassword(password);
    this.passwordList[index].password = decPassword;
  }
}
