import { Routes } from '@angular/router';
import { IndexComponent } from './modules/pages/index/index.component';

export const routes: Routes = [
        {
            path: '',
            component: IndexComponent,
            pathMatch: 'full'
        },
        {
          path: '**',
          component: IndexComponent
        }
];
