import { Component } from '@angular/core';
import { BaseFormComponent } from '../../base-form.component';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-dada-form',
  templateUrl: './dada-form.component.html',
  styleUrls: ['../../form.component.css']
})
export class DadaFormComponent extends BaseFormComponent {
  constructor(api: ApiService) {
    super(api);
    this.imageUrl = '../assets/dada_bank_logo.png';
  }
}
