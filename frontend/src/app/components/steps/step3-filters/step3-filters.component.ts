import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-step3-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './step3-filters.component.html',
  styleUrl: './step3-filters.component.scss'
})
export class Step3FiltersComponent {
  @Input() isStepCurrent = false;
  @Input() canAccessStep = false;
  @Input() isStepCompleted = false;
  @Input() selectedFilterColumn = '';
  @Input() selectedFiltersMap: Record<string, boolean> = {};
  @Input() selectedFilters: string[] = [];
  @Input() etapaValues: string[] = [];
  @Input() headers: string[] = [];
  @Output() filterColumnChange = new EventEmitter<string>();
  @Output() filterCheckboxChange = new EventEmitter<{value: string, checked: boolean}>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();
}
