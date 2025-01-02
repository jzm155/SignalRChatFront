import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-name-dialog',
  standalone: false,
  templateUrl: './name-dialog.component.html',
  styleUrl: './name-dialog.component.scss'
})
export class NameDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public name: string,
    public dialogRef: MatDialogRef<NameDialogComponent>
  ) { }

  ngOnInit() {

  }
}
