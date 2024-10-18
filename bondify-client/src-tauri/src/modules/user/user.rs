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
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub theme: String,
    pub language: String,
}

// Реализация логики для структуры UserData
impl UserData {
    // Конструктор для создания нового пользователя
    pub fn new(
        username: Option<String>, 
        access_token: Option<String>, 
        refresh_token: Option<String>, 
        theme: Option<String>, 
        language: Option<String>
    ) -> Self {
        UserData {
            username,
            access_token,
            refresh_token,
            theme: theme.unwrap_or_else(|| "dark".to_string()),
            language: language.unwrap_or_else(|| "en".to_string()),
        }
    }

    // Метод для обновления объекта с новыми данными
    pub fn update_with(&mut self, username: Option<String>, access_token: Option<String>, refresh_token: Option<String>, theme: Option<String>, language: Option<String>) {
        // Проверяем, изменились ли данные
        let has_changes = username != self.username || access_token != self.access_token || 
                         refresh_token != self.refresh_token || theme != Some(self.theme.clone()) || 
                         language != Some(self.language.clone());
    
        // Обновляем данные только если есть изменения
        if has_changes {
            self.username = username.or(self.username.clone());
            self.access_token = access_token.or(self.access_token.clone());
            self.refresh_token = refresh_token.or(self.refresh_token.clone());
            self.theme = theme.unwrap_or_else(|| self.theme.clone());
            self.language = language.unwrap_or_else(|| self.language.clone());
    
            // Сохраняем обновленные данные
            encrypt_user_data(self); // Вызываем только если были изменения
        }
    }
    
}

// Функция создания шифра
fn create_cipher(key: &[u8]) -> Aes256Gcm {
    Aes256Gcm::new_from_slice(key).unwrap() // Без логирования ошибок
}

// Функция получения ключа шифрования из .env файла
fn get_encryption_key() -> Vec<u8> {
    dotenv().ok(); // Загружаем переменные окружения из .env файла
    let key = env::var("ENCRYPTION_KEY").unwrap(); // Без логирования ошибок

    if key.len() != 32 {
        panic!("Encryption key must be 32 bytes long");
    }

    key.into_bytes() // Возвращаем ключ как Vec<u8>
}

// Функция шифрования данных пользователя
fn encrypt_user_data(data: &UserData) {
    let key = get_encryption_key(); // Получаем ключ шифрования
    let cipher = create_cipher(&key); // Создаем шифр

    let mut nonce = [0u8; 12]; 
    OsRng.fill_bytes(&mut nonce); // Генерация случайного nonce

    let serialized_data = serde_json::to_string(&data).unwrap(); // Сериализуем данные

    let ciphertext = cipher.encrypt(Nonce::from_slice(&nonce), serialized_data.as_bytes()).unwrap(); // Шифруем данные

    let mut file = File::create("userData.enc").unwrap(); // Создаем файл
    file.write_all(&[nonce.to_vec(), ciphertext].concat()).unwrap(); // Записываем nonce и шифрованные данные
}

// Функция дешифрования данных пользователя
fn decrypt_user_data() -> Option<UserData> {
    let key = get_encryption_key(); // Получаем ключ шифрования
    let cipher = create_cipher(&key); // Создаем шифр

    let mut file = File::open("userData.enc").unwrap(); // Открываем файл с зашифрованными данными
    
    let mut encrypted_data = Vec::new();
    file.read_to_end(&mut encrypted_data).unwrap(); // Читаем данные из файла

    let (nonce, ciphertext) = encrypted_data.split_at(12); // Делим данные на nonce и шифрованный текст

    let decrypted_data = cipher.decrypt(Nonce::from_slice(nonce), ciphertext).unwrap(); // Дешифруем данные
    

    let user_data = serde_json::from_slice(&decrypted_data).unwrap(); // Десериализуем данные

    Some(user_data)
}

// Функция возврата данных пользователя
pub fn get_user_data() -> Option<UserData> {
    decrypt_user_data()
}

// Функция для обновления данных пользователя
pub fn update_user_data(new_username: Option<String>, new_access_token: Option<String>, new_refresh_token: Option<String>, new_theme: Option<String>, new_language: Option<String>) -> Option<UserData> {
    if let Some(mut user_data) = decrypt_user_data() {
        // Обновляем данные пользователя
        user_data.update_with(new_username, new_access_token, new_refresh_token, new_theme, new_language);
        Some(user_data) // Возвращаем обновленные данные
    } else {
        None // Возвращаем None, если данных пользователя нет
    }
}

// Функция для создания данных пользователя
pub fn create_user_data() -> Option<UserData> {
    let user = UserData::new(
        Some("new_user".to_string()),
        Some("new_access_token".to_string()),
        Some("new_refresh_token".to_string()),
        Some("dark".to_string()),
        Some("en".to_string()),
    );
    encrypt_user_data(&user); // Шифруем и сохраняем данные
    Some(user) // Возвращаем созданного пользователя
}
