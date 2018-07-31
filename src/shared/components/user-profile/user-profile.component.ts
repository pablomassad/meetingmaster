import { Component } from '@angular/core';
import { AuthService } from 'fwk-auth';

@Component({
    selector: 'user-profile',
    templateUrl:'./user-profile.component.html'  //styleUrls:['./user-profile.component.scss']
})
export class UserProfileComponent {
    
    constructor( public auth: AuthService){
        console.log('UserProfileComponent constructor');
    } 


}