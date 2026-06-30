import { Component, ViewEncapsulation } from '@angular/core';
import { BaseFormComponent } from '../../base-form.component';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-kumbhi-form',
  templateUrl: './kumbhi-form.component.html',
  styleUrls: ['./kumbhi-form.component.css', '../../form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KumbhiFormComponent extends BaseFormComponent {
  constructor(api: ApiService) {
    super(api);
  }
}
