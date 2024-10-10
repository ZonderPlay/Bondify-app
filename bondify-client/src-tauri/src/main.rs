mod modules;
mod commands;
use modules::user::user; 
use tauri::{self, generate_context};
use commands::commands::{get_user_data_command, create_user_command};


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_user_command, get_user_data_command]) // Добавляем обработчики
        .run(generate_context!())
        .expect("error while running tauri application");
}


