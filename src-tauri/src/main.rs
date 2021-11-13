//
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use std::sync::{Arc, Mutex};
use tauri::{Manager, State, Window};

struct SplashscreenWindow(Arc<Mutex<Window>>);
struct MainWindow(Arc<Mutex<Window>>);

fn main() {
  tauri::Builder::default()
  .setup(|app| {
    // set the splashscreen and main windows to be globally available with the tauri state API
    app.manage(SplashscreenWindow(Arc::new(Mutex::new(
      app.get_window("splashscreen").unwrap(),
    ))));
    app.manage(MainWindow(Arc::new(Mutex::new(
      app.get_window("main").unwrap(),
    ))));
    Ok(())
  })
  .invoke_handler(tauri::generate_handler![close_splashscreen])
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}
#[tauri::command]
fn close_splashscreen(
  _: Window, // force inference of P
  splashscreen: State<SplashscreenWindow>,
  main: State<MainWindow>,
) {
  // Close splashscreen
  splashscreen.0.lock().unwrap().close().unwrap();
  // Show main window
  main.0.lock().unwrap().show().unwrap();
}
