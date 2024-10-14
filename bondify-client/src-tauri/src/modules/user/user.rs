use aes_gcm::aead::{Aead, KeyInit, OsRng};
use aes_gcm::{Aes256Gcm, Nonce};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs::File;
use std::io::{Read, Write};
use rand::RngCore;
use dotenv::dotenv;

// Структура данных пользователя
#[derive(Serialize, Deserialize, Debug)]
pub struct UserData {
    pub username: Option<String>,
    pub asses_token: Option<String>,
    pub refresh_token: Option<String>,
    pub theme: String,
    pub language: String,
}

// Реализация логики для структуры UserData
impl UserData {
    // Конструктор для создания нового пользователя
    pub fn new(
        username: Option<String>, 
        asses_token: Option<String>, 
        refresh_token: Option<String>, 
        theme: Option<String>, 
        language: Option<String>
    ) -> Self {
        UserData {
            username,
            asses_token,
            refresh_token,
            theme: theme.unwrap_or_else(|| "dark".to_string()),
            language: language.unwrap_or_else(|| "en".to_string()),
        }
    }

    // Метод для обновления объекта с новыми данными
    pub fn update_with(&mut self, username: Option<String>, asses_token: Option<String>, refresh_token: Option<String>, theme: Option<String>, language: Option<String>) {
        // Обновляем данные текущего пользователя
        self.username = username.or(self.username.clone());
        self.asses_token = asses_token.or(self.asses_token.clone());
        self.refresh_token = refresh_token.or(self.refresh_token.clone());
        self.theme = theme.unwrap_or(self.theme.clone());
        self.language = language.unwrap_or(self.language.clone());

        // Сохраняем обновленные данные
        encrypt_user_data(self);
    }
}



// Функция получения ключа шифрования из .env файла
fn get_encryption_key() -> Vec<u8> {
    dotenv().ok(); // Загружаем переменные окружения из .env файла
    let key = env::var("ENCRYPTION_KEY").expect("ENCRYPTION_KEY must be set");

    if key.len() != 32 {
        panic!("Encryption key must be 32 bytes long");
    }

    key.into_bytes() // Возвращаем ключ как Vec<u8>
}

// Функция шифрования данных пользователя
fn encrypt_user_data(data: &UserData) {
    let key = get_encryption_key(); // Получаем ключ шифрования
    let cipher = Aes256Gcm::new_from_slice(&key).expect("Invalid key length");

    let mut nonce = [0u8; 12]; 
    OsRng.fill_bytes(&mut nonce); // Генерация случайного nonce

    let serialized_data = serde_json::to_string(&data).expect("Serialization failed");

    let ciphertext = cipher.encrypt(Nonce::from_slice(&nonce), serialized_data.as_bytes())
        .expect("Encryption failed");

    let mut file = File::create("userData.enc").expect("Unable to create file");
    file.write_all(&[nonce.to_vec(), ciphertext].concat()).expect("Unable to write data");
}

// Функция дешифрования данных пользователя
fn decrypt_user_data() -> Option<UserData> {
    let key = get_encryption_key(); // Получаем ключ шифрования
    let cipher = Aes256Gcm::new_from_slice(&key).expect("Invalid key length");

    let mut file = File::open("userData.enc").ok()?; // Открываем файл с зашифрованными данными
    
    let mut encrypted_data = Vec::new();
    file.read_to_end(&mut encrypted_data).expect("Unable to read data");

    let (nonce, ciphertext) = encrypted_data.split_at(12);

    let decrypted_data = cipher.decrypt(Nonce::from_slice(nonce), ciphertext)
        .ok()?; // Дешифруем данные

    serde_json::from_slice(&decrypted_data).ok() // Десериализуем и возвращаем объект UserData
}

// Функция возврата данных пользователя
pub fn get_user_data() -> Option<UserData> {
    decrypt_user_data()
}
// Функция для обновления данных пользователя
pub fn update_user_data(new_username: Option<String>, new_asses_token: Option<String>, new_refresh_token: Option<String>, new_theme: Option<String>, new_language: Option<String>) -> Option<UserData> {
    if let Some(mut user_data) = decrypt_user_data() {
        // Обновляем данные пользователя
        user_data.update_with(new_username, new_asses_token, new_refresh_token, new_theme, new_language);
        Some(user_data) // Возвращаем обновленные данные
    } else {
        None // Возвращаем None, если данных пользователя нет
    }
}
pub fn create_user_data() -> Option<UserData> {
    let user = UserData::new(
        Some("new_user".to_string()),
        Some("new_access_token".to_string()),
        Some("new_refresh_token".to_string()),
        Some("dark".to_string()),
        Some("en".to_string()),
    );
    encrypt_user_data(&user);
    Some(user) // Возвращаем созданного пользователя
}