//! Astro-Amriit desktop shell (codename KAAST 2; ARCHITECTURE.md §6, ADR-9).
//!
//! Opens one window that shows the offline site build (`../dist-site`),
//! served from inside the app bundle. The app registers no commands and no
//! plugins: it never touches the network or a shell.

// No extra console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::WebviewWindowBuilder;

/// Configured window size (tauri.conf.json) plus room for title bar and taskbar.
const FITS_W: f64 = 1400.0 + 40.0;
const FITS_H: f64 = 950.0 + 80.0;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // The "main" window is declared in tauri.conf.json with
            // `"create": false` and built here, so it can get a download hook.
            let cfg = app
                .config()
                .app
                .windows
                .iter()
                .find(|w| w.label == "main")
                .cloned()
                .expect("tauri.conf.json declares the main window");
            let builder = WebviewWindowBuilder::from_config(app.handle(), &cfg)?;

            // "Save chart" uses <a download> on a Blob. WebView2 (Windows)
            // handles that natively with its own download bar, so Windows is
            // left alone. WKWebView (macOS) and WebKitGTK cancel downloads
            // unless the host allows them: allow, and keep wry's default
            // destination (the user's Downloads folder, never overwriting).
            #[cfg(not(windows))]
            let builder = builder.on_download(|_webview, _event| true);

            let win = builder.build()?;

            // Older laptops (1366x768, 1280x800) are smaller than the default
            // window; maximise there so nothing opens off-screen.
            if let Ok(Some(mon)) = win.current_monitor() {
                let size = mon.size().to_logical::<f64>(mon.scale_factor());
                if size.width < FITS_W || size.height < FITS_H {
                    let _ = win.maximize();
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Astro-Amriit could not start");
}
