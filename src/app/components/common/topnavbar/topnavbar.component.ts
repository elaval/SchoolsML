import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
declare var jQuery: any;

@Component({
    selector: 'app-topnavbar',
    styleUrls: ['./topnavbar.css'],
    templateUrl: 'topnavbar.template.html'
})
export class TopnavbarComponent {
    searchText: string;

    constructor(
        private dataService:DataService,
        private authService:AuthService
    ) {}

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar');
        smoothlyMenu();
    }

    logout() {
        this.authService.logout();
    }


    onEnter(question) {
    }

}
