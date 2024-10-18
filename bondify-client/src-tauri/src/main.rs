mod commands;
mod modules;

use tauri::{self, generate_context};
use commands::commands::{
    get_user_data_command, create_user_data_command, update_user_data_command
};
use dotenv::dotenv;
use rand::{distributions::Alphanumeric, Rng};
use std::env;
use std::fs;
use std::path::PathBuf;
use std::io::Write; // Импортируем для использования writeln!

fn main() {
    // Генерация и запись ключа в .env
    generate_and_store_key("../.env");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_user_data_command,
            get_user_data_command,
            update_user_data_command
        ])
        .run(generate_context!())
        .expect("error while running tauri application");
}

fn generate_key() -> String {
    let key: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(32) // 32 символа
        .map(char::from)
        .collect();
    key
}

fn generate_and_store_key(env_path: &str) {
    // Загружаем переменные окружения из файла
    dotenv().ok();

    // Проверяем, существует ли переменная окружения с ключом
    if env::var("ENCRYPTION_KEY").is_err() {
        let key = generate_key();

        // Путь к файлу .env
        let env_file_path = PathBuf::from(env_path);

        // Записываем ключ в .env файл
        let mut env_file = fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&env_file_path)
            .unwrap();

        writeln!(env_file, "ENCRYPTION_KEY={}", key).unwrap();
    } else {
        println!("Ключ уже существует.");
    }
}
