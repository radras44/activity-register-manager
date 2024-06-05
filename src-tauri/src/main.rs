// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use std::env;

#[tauri::command]
fn is_dev () -> bool {
    let variable : Result<String,env::VarError> = env::var("IS_DEV");
    match variable {
        Ok(_is_dev) => true,
        Err(_error) => false
    }
}

fn main() {
    println!("dev enviroment = {}",is_dev());
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![is_dev])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
