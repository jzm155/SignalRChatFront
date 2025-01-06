import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@microsoft/signalR';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NameDialogComponent } from '../../shared/name-dialog/name-dialog.component';

interface Message{
  username: string,
  text: string,
  sendDate: string,
  sendHours: string
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
      var dateNow = new Date();
      this.messages.push({
        text: text,
        username: username,
        sendDate: ("0" + dateNow.getDate()).slice(-2) + '/' + ("0" + (dateNow.getMonth() + 1)).slice(-2) + '/' + dateNow.getFullYear(),
        sendHours: ("0" + dateNow.getHours()).slice(-2) + ':' + ("0" + dateNow.getMinutes()).slice(-2)
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
