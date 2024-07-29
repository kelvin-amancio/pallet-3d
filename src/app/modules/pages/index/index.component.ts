import { Component } from '@angular/core';
import { PalletComponent } from "../../components/pallet/pallet.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [PalletComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

}
