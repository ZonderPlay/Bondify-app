use crate::modules::user::user::{UserData, get_user_data, update_user_data, create_user_data};
use std::fs;

#[tauri::command]
pub fn create_user_data_command() -> Result<UserData, String> {
    // Проверяем, существует ли файл с зашифрованными данными
    if fs::metadata("userData.enc").is_ok() {
        // Если файл существует, загружаем данные пользователя
        if let Some(existing_user) = get_user_data() {
            println!("Загружены существующие данные пользователя.");
            Ok(existing_user)
        } else {
            Err("Не удалось расшифровать или загрузить данные пользователя.".to_string())
        }
    } else {
        // Если файла нет, создаем нового пользователя
        println!("Создание нового пользователя.");
        
        // Создаем нового пользователя и возвращаем результат
        match create_user_data() {
            Some(user) => Ok(user), // Возвращаем Ok(user) если создание прошло успешно
            None => Err("Не удалось создать нового пользователя.".to_string()), // Обработка случая, когда создание не удалось
        }
    }
}



// Получение данных пользователя
#[tauri::command]
pub fn get_user_data_command() -> Result<Option<UserData>, String> {
    match get_user_data() {
        Some(user_data) => Ok(Some(user_data)),
        None => Err("Не удалось получить данные пользователя.".to_string()),
    }
}

// Обновление данных пользователя
#[tauri::command]
pub fn update_user_data_command(
    username: Option<String>,
    access_token: Option<String>,
    refresh_token: Option<String>,
    theme: Option<String>,
    language: Option<String>,
) -> Result<String, String> {
    let update_result = update_user_data(username, access_token, refresh_token, theme, language);
    
    // Проверка успешности обновления
    if update_result.is_some() {
        Ok("Данные пользователя успешно обновлены.".to_string())
    } else {
        Err("Не удалось обновить данные пользователя.".to_string())
    }
}

