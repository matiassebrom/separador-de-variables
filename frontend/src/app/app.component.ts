import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
  // RouterOutlet,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
  MatChipsModule,
  FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  selectedFilterColumn: string = '';
  selectedFiltersMap: Record<string, boolean> = {};
  selectedColumnsMap: Record<string, boolean> = {};

  ngOnInit() {
    // Inicializar los mapas para checkboxes
    this.etapaValues.forEach((val: string) => {
      this.selectedFiltersMap[val] = this.selectedFilters.includes(val);
    });
    this.headers.forEach((header: string) => {
      this.selectedColumnsMap[header] = this.selectedColumns.includes(header);
    });
  }

  onFilterCheckboxModelChange(value: string, checked: boolean) {
    if (checked) {
      if (!this.selectedFilters.includes(value)) {
        this.selectedFilters.push(value);
      }
    } else {
      const idx = this.selectedFilters.indexOf(value);
      if (idx > -1) {
        this.selectedFilters.splice(idx, 1);
      }
    }
  }

  onColumnCheckboxModelChange(header: string, checked: boolean) {
    if (checked) {
      if (!this.selectedColumns.includes(header)) {
        this.selectedColumns.push(header);
      }
    } else {
      const idx = this.selectedColumns.indexOf(header);
      if (idx > -1) {
        this.selectedColumns.splice(idx, 1);
      }
    }
  }
  title = 'split-excel-frontend';
  currentStep = 1;
  fileUploaded = false;
  selectedSeparateBy = 'ORIGEN';
  selectedColumns = ['ORIGEN', 'ETAPA', 'ID', 'TIPO'];
  baseName = 'datos_separados';
  headers = ['StartDate', 'RecordedDate', 'ResponseId', 'ORIGEN', 'Q_TerminateFlag', 'ETAPA', 'ID', 'TIPO', 'EDAD', 'EDAD_COD', 'FILTRO', 'CUOTAFULL', 'F11-EMPRESARIAL', 'suma_eval'];
  etapaValues = ['Activos', 'Inactivos', 'Pendientes'];
  selectedFilters = ['Activos', 'Inactivos'];
  previewFiles = [
    { name: 'datos_separados - ORIGEN - WEB.xlsx', excluded: false },
    { name: 'datos_separados - ORIGEN - MOBILE.xlsx', excluded: false },
    { name: 'datos_separados - ORIGEN - EMAIL.xlsx', excluded: true }
  ];


  get includedPreviewFiles() {
    return this.previewFiles.filter(f => !f.excluded);
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }
  isStepCompleted(step: number): boolean {
    return this.currentStep > step;
  }
  isStepCurrent(step: number): boolean {
    return this.currentStep === step;
  }
  canAccessStep(step: number): boolean {
    return step <= this.currentStep;
  }
  onFileUpload() {
    this.fileUploaded = true;
    this.nextStep();
  }
  toggleFileExclusion(index: number) {
    this.previewFiles[index].excluded = !this.previewFiles[index].excluded;
  }
}
