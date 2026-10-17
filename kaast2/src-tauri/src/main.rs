//! KAAST 2 desktop shell (ARCHITECTURE.md §6, ADR-9).
//!
//! Opens one window that shows the offline site build (`../dist-site`),
//! served from inside the app bundle. The app registers no commands and no
//! plugins: it never touches the network, the file system or a shell.

// No extra console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

/// Configured window size (tauri.conf.json) plus room for title bar and taskbar.
const FITS_W: f64 = 1400.0 + 40.0;
const FITS_H: f64 = 950.0 + 80.0;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Older laptops (1366x768, 1280x800) are smaller than the default
            // window; maximise there so nothing opens off-screen.
            if let Some(win) = app.get_webview_window("main") {
                if let Ok(Some(mon)) = win.current_monitor() {
                    let size = mon.size().to_logical::<f64>(mon.scale_factor());
                    if size.width < FITS_W || size.height < FITS_H {
                        let _ = win.maximize();
                    }
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("KAAST 2 could not start");
}
