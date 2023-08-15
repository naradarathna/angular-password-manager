import { Component } from '@angular/core';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent {

  allSites !: Observable<Array<any>>;

  siteName !: string;
  siteUrl !: string;
  siteImgUrl !: string;
  siteId !: string;

  formState : string = "Add New";
  isSuccess: boolean = false;
  message: string = "";
  isHidden: boolean = false;

  constructor(private passwordManagerService: PasswordManagerService){
    this.loadSites();
  }
  onSubmit(values: object){
    if(this.formState == "Add New"){
      this.passwordManagerService.addSite(values).then(()=>{
        this.isSuccess = true;
        this.message = "Added new site successfully";
      }).catch(err => {
        this.message = err;
      })
    }
    else if(this.formState == "Edit"){
      this.passwordManagerService.updateSite(this.siteId, values).then(()=>{
        this.isSuccess = true;
        this.message = "Edited site successfully";
      }).catch(err => {
        this.message = err;
      })
    }
  }

  ngOnInt() {
      
  }

  ngAfterViewInit() {
  }

  loadSites(){
    
    this.allSites = this.passwordManagerService.loadSites();
  }

  editSite(siteName : string, siteUrl : string, siteImgUrl : string, id : string) {
    this.formState = "Edit"
    this.siteName = siteName;
    this.siteUrl = siteUrl;
    this.siteImgUrl = siteImgUrl;
    this.siteId = id;
  }

  deleteSite(id: string){
    this.passwordManagerService.deleteSite(id).then(()=>{
      this.isSuccess = true;
      this.message = "Deleted site successfully";
    }).catch(err => {
      this.message = err;
    })
  }
}
