import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
	selector: 'app-multi-select-list',
	standalone: true,
	imports: [CommonModule, MatCheckboxModule],
	templateUrl: './multi-select-list.component.html',
	styleUrl: './multi-select-list.component.scss',
})
export class MultiSelectListComponent {
	@Input() uniqueValues: string[] = [];
	@Input() selectedUniqueValues: string[] = [];
	@Output() selectedUniqueValuesChange = new EventEmitter<string[]>();

	onToggle(value: string, checked: boolean) {
		let updated = [...this.selectedUniqueValues];
		if (checked) {
			if (!updated.includes(value)) updated.push(value);
		} else {
			updated = updated.filter((v) => v !== value);
		}
		this.selectedUniqueValuesChange.emit(updated);
	}
}
