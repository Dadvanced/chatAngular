import { Component, OnInit } from '@angular/core';
import { Client } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { Mensaje } from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // atributos
  private client: Client;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  escribiendo: string;

  constructor() { }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      //return new SockJS("http://localhost:2000/chat-websocket"); // puerto estándar
      return new SockJS("http://192.168.0.250:2000/chat-websocket"); // para entrar por aquí necesitamos hacer un ng serve --host=0.0.0.0 --disable-host-check
      //return new SockJS("http://188.85.204.178:132/chat-websocket");
    }

    this.client.onConnect = (frame) => {
      console.log("Conectado: " + this.client.connected + " : " +  frame);
      this.conectado = true;

      this.client.subscribe("/chat/mensaje", e => {
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha);

        if (!this.mensaje.color && mensaje.tipo == "NUEVO_USUARIO" && this.mensaje.username == mensaje.username){
          this.mensaje.color = mensaje.color;
        }

        this.mensajes.push(mensaje);
        console.log(mensaje);
      });

      this.client.subscribe("/chat/escribiendo", e => {
        this.escribiendo = e.body;
        setTimeout(() => {this.escribiendo = "";}, 3000);
      });

      this.mensaje.tipo = "NUEVO_USUARIO";
      this.client.publish({destination: "/app/mensaje", body: JSON.stringify(this.mensaje)});
    }

    this.client.onDisconnect = (frame) => {
      this.conectado = false;
      console.log("Desconectado: " + !this.client.connected + " : " +  frame);
    }
  }

  conectar(): void {
    this.client.activate();
  }

  desconectar(): void {
    this.client.deactivate();
  }

  enviarMensaje(): void {
    this.mensaje.tipo = "MENSAJE";
    this.client.publish({destination: "/app/mensaje", body: JSON.stringify(this.mensaje)});
    this.mensaje.texto = "";
  }

  escribiendoEvento(): void {
    this.client.publish({destination: "/app/escribiendo", body: this.mensaje.username});
  }

}
