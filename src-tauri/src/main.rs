#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::{
  api::process::{Command, CommandEvent},
  Manager,
};
#[cfg(windows)]
extern crate winapi;

fn main() {
  unsafe {
  winapi::um::shellscalingapi::SetProcessDpiAwareness(4);
  }
  tauri::Builder::default().setup(|app| {
    let window = app.get_window("main").unwrap();
    tauri::async_runtime::spawn(async move {
      let (mut rx, _child) = Command::new_sidecar("notify")
        .expect("failed to setup `app` sidecar")
        .spawn().expect("Fail");

        tauri::async_runtime::spawn(async move {
          // read events such as stdout
          while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line) = event {
              window
                .emit("notify", Some(format!("'{}'", line)))
                .expect("failed to emit event");
            }
          }
        });
    });

    Ok(())

  })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
