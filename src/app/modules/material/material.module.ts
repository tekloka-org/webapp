import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';

const MATERIAL_COMPONENTS = [
  MatDialogModule,
  MatMenuModule,
  MatIconModule,
  MatCardModule,
  MatStepperModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatSortModule,
  MatTooltipModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatTabsModule,
  MatGridListModule,
  MatBadgeModule,
  MatCheckboxModule,
  DragDropModule
];

@NgModule({
  imports: [
    MATERIAL_COMPONENTS
  ],
  exports: [
    MATERIAL_COMPONENTS
  ]
})
export class MaterialModule { }
