use crate::modules::user::user::{UserData, get_user_data};
use std::fs;

#[tauri::command]
pub fn create_user_command() -> Result<UserData, String> {
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
        let user = UserData::new(
            Some("new_user".to_string()),
            Some("new_access_token".to_string()),
            Some("new_refresh_token".to_string()),
            Some("light".to_string()),
            Some("fr".to_string()),
        );
        
        Ok(user)
    }
}


#[tauri::command]
pub fn get_user_data_command() -> Result<Option<UserData>, String> {
    // Здесь реализуйте логику получения данных пользователя
    match get_user_data() {
        Some(user_data) => Ok(Some(user_data)),
        None => Err("Не удалось получить данные пользователя.".to_string()),
    }
}
