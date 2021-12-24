#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use cpal::Device;
use cpal::Devices;
use std::iter::Filter;
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
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      tauri::async_runtime::spawn(async move {
        let (mut rx, _child) = Command::new_sidecar("notify")
          .expect("failed to setup `app` sidecar")
          .spawn()
          .expect("Fail");

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
    .invoke_handler(tauri::generate_handler![play_sound, list_inputs])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn play_sound(path: String) -> Result<String, String> {
  use soloud::*;
  use tauri::api::file::read_binary;
  let sl = Soloud::default().unwrap();
  let mut wav = audio::Wav::default();
  wav
    .load_mem(&read_binary(&path).expect("File couldn't be found")[..])
    .unwrap();
  sl.play(&wav);
  while sl.voice_count() > 0 {
    std::thread::sleep(std::time::Duration::from_millis(100));
  }
  return Ok("Finished sound".into());
}
#[tauri::command]
fn list_inputs() -> Result<Vec<String>, String> {
  use cpal::traits::DeviceTrait;
  use cpal::traits::HostTrait;
  let host = cpal::default_host();
  let devices = host.input_devices().unwrap();
  let mut deviceSafety = Vec::new();
  for i in devices {
    println!("Input {} Sample {:?}", i.name().unwrap(), i.default_input_config().unwrap().sample_rate());
    deviceSafety.push(i.name().unwrap());
  }
  return Ok(deviceSafety);
}
