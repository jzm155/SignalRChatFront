import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@microsoft/signalR';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NameDialogComponent } from '../../shared/name-dialog/name-dialog.component';

interface Message{
  username: string,
  text: string
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  messages: Message[] = [];

  messageControl = new FormControl('');
  username!: string;
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7128/chat")
    .build()
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.openDialog()   
  }

  ngOnInit() {

  }

  openDialog() {
    const dialogRef = this.dialog.open(NameDialogComponent, {
      width: '250px',
      data: this.username,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.username = result;
      this.startConnection();
    });
  }

  startConnection() {
    this.connection.on("newMessage", (username: string, text: string) => {
      this.messages.push({
        text: text,
        username: username
      })
    });

    this.connection.on("newUser", (username: string) => {

    });

    this.connection.on("previousMessages", (messages: Message[]) => {
      this.messages = messages;
    })

    this.connection.start()
      .then(() => {
        this.connection.send("newMessage", '', `${this.username} acabou de entrar`);
        this.connection.send("newUser", this.username, this.connection.connectionId);
      });
  }

  sendMessage() {
    this.connection.send("newMessage", this.username, this.messageControl.value)
      .then(() => {
        this.messageControl.setValue('');
      })
  }
}
