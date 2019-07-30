import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from './shared';
import { PrimengDatepickerComponent } from './primeng-datepicker.component';

@NgModule({
  declarations: [PrimengDatepickerComponent],
  imports: [CommonModule, ButtonModule, SharedModule],
  exports: [PrimengDatepickerComponent, SharedModule]
})
export class PrimengDatepickerModule {}
