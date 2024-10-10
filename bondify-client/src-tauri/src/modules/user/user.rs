// modules/users/user.rs
use aes_gcm::aead::{Aead, KeyInit, OsRng};
use aes_gcm::{Aes256Gcm, Nonce};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs::File;
use std::io::{Read, Write};
use rand::RngCore;

// Структура данных пользователя
#[derive(Serialize, Deserialize, Debug)]
pub struct UserData {
    pub username: Option<String>,
    pub asses_token: Option<String>,
    pub refresh_token: Option<String>,
    pub theme: String,
    pub language: String,
}

// Реализация значений по умолчанию для структуры
impl Default for UserData {
    fn default() -> Self {
        UserData {
            username: None,
            asses_token: None,
            refresh_token: None,
            theme: "dark".to_string(),
            language: "en".to_string(),
        }
    }
}

// Реализация логики для структуры UserData
impl UserData {
    // Конструктор для создания нового пользователя и автоматического шифрования данных
    pub fn new(
        username: Option<String>, 
        asses_token: Option<String>, 
        refresh_token: Option<String>, 
        theme: Option<String>, 
        language: Option<String>
    ) -> Self {
        let mut user_data = UserData {
            username,
            asses_token,
            refresh_token,
            theme: theme.unwrap_or_else(|| "dark".to_string()),
            language: language.unwrap_or_else(|| "en".to_string()),
        };

        // Автоматическое шифрование данных при создании пользователя
        encrypt_user_data(&user_data);

        user_data
    }
}

// Функция получения ключа шифрования
fn get_encryption_key() -> Vec<u8> {
    dotenv::dotenv().ok(); // Загружаем переменные окружения из .env файла
    let key = env::var("ENCRYPTION_KEY").expect("ENCRYPTION_KEY must be set");

    if key.len() != 32 {
        panic!("Encryption key must be 32 bytes long");
    }

    key.into_bytes() // Возвращаем ключ как Vec<u8>
}

// Функция шифрования данных пользователя
pub fn encrypt_user_data(data: &UserData) {
    let key = get_encryption_key(); // Получаем ключ при вызове функции
    let cipher = Aes256Gcm::new_from_slice(&key).expect("Invalid key length");
    
    let mut nonce = [0u8; 12]; 
    OsRng.fill_bytes(&mut nonce);
    
    let serialized_data = serde_json::to_string(data).expect("Serialization failed");
    
    let ciphertext = cipher.encrypt(Nonce::from_slice(&nonce), serialized_data.as_bytes())
        .expect("Encryption failed");
    
    let mut file = File::create("userData.enc").expect("Unable to create file");
    file.write_all(&[nonce.to_vec(), ciphertext].concat()).expect("Unable to write data");
}

// Функция дешифрования данных пользователя
pub fn decrypt_user_data() -> Option<UserData> {
    let key = get_encryption_key(); // Получаем ключ при вызове функции
    let cipher = Aes256Gcm::new_from_slice(&key).expect("Invalid key length");
    
    let mut file = File::open("userData.enc").expect("Unable to open file");
    
    let mut encrypted_data = Vec::new();
    file.read_to_end(&mut encrypted_data).expect("Unable to read data");
    
    let (nonce, ciphertext) = encrypted_data.split_at(12);
    
    let decrypted_data = cipher.decrypt(Nonce::from_slice(nonce), ciphertext)
        .expect("Decryption failed");
    
    let user_data: UserData = serde_json::from_slice(&decrypted_data).expect("Deserialization failed");
    Some(user_data)
}

// Функция возврата данных пользователя
pub fn get_user_data() -> Option<UserData> {
    decrypt_user_data()
}
