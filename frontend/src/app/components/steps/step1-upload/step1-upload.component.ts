import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step1-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './step1-upload.component.html',
  styleUrl: './step1-upload.component.scss'
})
export class Step1UploadComponent {
  @Input() isStepCurrent = false;
  @Input() canAccessStep = true;
  @Input() isStepCompleted = false;
  @Input() fileUploaded = false;
  @Input() headersLength = 0;
  
  @Output() fileUpload = new EventEmitter<void>();

  onFileUpload() {
    this.fileUpload.emit();
  }
}
