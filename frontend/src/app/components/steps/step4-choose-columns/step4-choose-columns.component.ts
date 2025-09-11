import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-step4-choose-columns',
	standalone: true,
	imports: [CommonModule, FormsModule, MatExpansionModule, MatCheckboxModule, MatButtonModule, MatIconModule],
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

	onCheckboxChange(header: string, checked: boolean) {
		this.columnCheckboxChange.emit({ header, checked });
	}

	onContinue() {
		this.nextStep.emit();
	}
}
