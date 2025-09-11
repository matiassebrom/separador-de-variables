import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-step4-choose-columns',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatExpansionModule,
		MatCheckboxModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		MatChipsModule
	],
	templateUrl: './step4-choose-columns.component.html',
	styleUrl: './step4-choose-columns.component.scss'
})
export class Step4ChooseColumnsComponent {
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;
	@Input() headers: string[] = [];
	@Input() selectedColumnsMap: Record<string, boolean> = {};
	@Input() selectedColumns: string[] = [];
	@Output() columnCheckboxChange = new EventEmitter<{ header: string; checked: boolean }>();
	@Output() nextStep = new EventEmitter<void>();

	headerSearchTerm: string = '';

	get filteredHeaders(): string[] {
		if (!this.headerSearchTerm) return this.headers;
		return (this.headers || []).filter(
			(h: string) => h && h.toLowerCase().includes(this.headerSearchTerm.toLowerCase())
		);
	}

	toggleColumn(header: string) {
		const checked = !this.selectedColumnsMap[header];
		this.selectedColumnsMap[header] = checked;
		this.onCheckboxChange(header, checked);
	}

	onCheckboxChange(header: string, checked: boolean) {
		this.columnCheckboxChange.emit({ header, checked });
	}

	onContinue() {
		this.nextStep.emit();
	}
}
