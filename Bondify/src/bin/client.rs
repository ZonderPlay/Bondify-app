use tokio_tungstenite::connect_async;
use tokio_tungstenite::tungstenite::protocol::Message;
use futures_util::{SinkExt, StreamExt};

#[tokio::main]
async fn main() {
    // Установим соединение с сервером
    let (mut ws_stream, _) = connect_async("ws://127.0.0.1:8080").await.expect("Failed to connect");

    // Отправим сообщение на сервер
    let message = "Hello, server!";
    ws_stream.send(Message::Text(message.to_string())).await.expect("Failed to send message");

    // Ждем ответ от сервера
    while let Some(Ok(msg)) = ws_stream.next().await {
        match msg {
            Message::Text(text) => {
                println!("Received from server: {}", text);
            }
            _ => {}
        }
    }
}
