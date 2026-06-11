import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client = null;

export const connectWebSocket = (
  callback
) => {

  client = new Client({

    webSocketFactory: () =>
      new SockJS(
        'http://localhost:8080/ws'
      ),

    reconnectDelay: 5000,

    onConnect: () => {

      console.log(
        'WebSocket Connected'
      );

      client.subscribe(
        '/topic/disasters',
        (message) => {

          callback(
            JSON.parse(
              message.body
            )
          );

        }
      );

    }

  });

  client.activate();

};

export const disconnectWebSocket =
() => {

  if (client) {

    client.deactivate();

  }

};