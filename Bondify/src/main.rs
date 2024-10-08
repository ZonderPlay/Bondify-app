use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::protocol::Message;
use futures_util::{StreamExt, SinkExt};

async fn handle_connection(raw_stream: TcpStream) {
    // Асинхронный прием WebSocket подключения
    let ws_stream = accept_async(raw_stream).await.expect("Error during WebSocket handshake");

    // Обрабатываем сообщения от клиента
    let (mut write, mut read) = ws_stream.split();
    while let Some(Ok(msg)) = read.next().await {
        if let Message::Text(text) = msg {
            println!("Received: {}", text);
            // Ответ сервером обратно клиенту
            write.send(Message::Text(text)).await.expect("Failed to send message");
        }
    }
}

#[tokio::main]
async fn main() {
    // Поднимаем TCP сервер на порту 8080
    let listener = TcpListener::bind("127.0.0.1:8080").await.expect("Failed to bind");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(handle_connection(stream));
    }
}
