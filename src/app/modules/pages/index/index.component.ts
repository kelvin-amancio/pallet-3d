import { Component } from '@angular/core';
import { PalletComponent } from "../../components/pallet/pallet.component";
import { LoadComponent } from "../../components/load/load.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [PalletComponent, LoadComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

}
