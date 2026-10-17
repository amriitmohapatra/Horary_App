KAAST 2 - Install from a USB stick
==================================

KAAST 2 works with no internet at all. You do not need Wi-Fi or mobile data,
not to install it and not to use it. It sends nothing anywhere and never
updates itself.

The version number in the file names (for example v0.1.0) may be different
on your stick. That is fine.


What is on the USB stick
------------------------

- KAAST 2 Setup v0.1.0.exe ... for Windows (use this one)
- KAAST 2 v0.1.0.msi ......... for Windows (only if someone asks you to)
- KAAST 2 v0.1.0.dmg ......... for Mac
- SHA256SUMS.txt ............. fingerprints of the files (optional check)
- READ ME FIRST - install guide.txt ... this guide


Windows (Windows 10 or Windows 11, 64-bit)
------------------------------------------

Install

1. Put the USB stick in the computer.
2. Open the USB stick in File Explorer.
3. Copy "KAAST 2 Setup v0.1.0.exe" to your Desktop.
4. Double-click the file on your Desktop.
5. A blue box may say "Windows protected your PC".
   This happens because the app is free and not registered with Microsoft.
   Click "More info". Then click "Run anyway".
6. If Windows asks "Do you want to allow this app to make changes?",
   click "Yes".
7. Click "Next". Click "Next" again. Click "Install". Wait.
   On some older computers this takes 2 to 5 minutes, because the
   installer also adds a Microsoft part that KAAST 2 needs (WebView2).
   It is on the stick already. Nothing is downloaded.
8. Leave "Create desktop shortcut" ticked. Click "Finish".

Open

1. Click the Start button.
2. Type: KAAST 2
3. Click "KAAST 2".

There is also a "KAAST 2" icon on the Desktop.

Uninstall

1. Click the Start button. Click "Settings".
2. Click "Apps" (on Windows 10: "Apps", then "Apps & features").
3. Find "KAAST 2". Click it (or the three dots next to it).
4. Click "Uninstall". Click "Uninstall" again.
5. If you also want to delete your saved places and settings,
   tick "Delete the application data" before you click "Uninstall".


Mac (macOS 11 Big Sur or newer, Intel or Apple chip)
----------------------------------------------------

Install

1. Put the USB stick in the Mac.
2. Open the USB stick in Finder.
3. Double-click "KAAST 2 v0.1.0.dmg". A window opens.
4. Drag the "KAAST 2" icon onto the "Applications" folder in that window.
5. Close the window. In Finder, click the eject arrow next to "KAAST 2"
   in the sidebar.

Open for the first time

The Mac may say the app is from an "unidentified developer" or "cannot be
verified". This happens because the app is free and not registered with
Apple. You only need to do this once.

1. Open Finder. Click "Applications".
2. Hold the "control" key and click "KAAST 2". (Or right-click it.)
3. Click "Open".
4. In the message, click "Open" again.

If there is no "Open" button in step 4 (macOS 15 Sequoia and newer):

1. Click "Done" (or "OK").
2. Click the Apple menu (top left). Click "System Settings".
3. Click "Privacy & Security" in the left column.
4. Scroll down. Next to "KAAST 2 was blocked", click "Open Anyway".
5. Type your Mac password. Click "Open Anyway" again.

After that, open KAAST 2 from Applications or Launchpad like any other app.

Uninstall

1. Open Finder. Click "Applications".
2. Drag "KAAST 2" to the Trash. Empty the Trash.


Optional: check that the files are not damaged
----------------------------------------------

You can skip this. It proves the file on the stick is exactly the file
that was built.

Windows:

1. Click the Start button. Type: PowerShell. Press Enter.
2. Type  Get-FileHash  and a space.
3. Drag "KAAST 2 Setup v0.1.0.exe" from the USB stick into the blue window.
4. Press Enter. A long line of letters and numbers appears.
5. Open SHA256SUMS.txt (double-click it). Find the line that ends with the
   same file name. The letters and numbers must be the same.
   (Capital or small letters do not matter.)

Mac:

1. Open "Terminal" (Applications, then Utilities).
2. Type  shasum -a 256  and a space.
3. Drag "KAAST 2 v0.1.0.dmg" from the USB stick into the Terminal window.
4. Press Return. Compare the long code with the line for the .dmg in
   SHA256SUMS.txt. It must be the same.

If the codes are different, do not install. Ask for a new copy.


If it does not start
--------------------

1. Wait 30 seconds. The first start can be slow on an old computer.
2. Restart the computer. Try again.
3. Windows: uninstall KAAST 2, then install it again from the stick.
   Mac: drag KAAST 2 to the Trash, then install it again from the stick.
4. Mac says the app "is damaged and can't be opened":
   a. Open "Terminal" (Applications, then Utilities).
   b. Type exactly:  xattr -cr /Applications/KAAST\ 2.app
   c. Press Return. Open KAAST 2 again.
5. Check the computer:
   - Windows must be Windows 10 or 11, 64-bit. Windows 7 and 8 do not work.
   - Mac must be macOS 11 Big Sur or newer.
6. Still not working? Take a photo of the screen and of the message.
   Write down the Windows or macOS version. Give both to the person who
   gave you the USB stick.


For the person who prepares the USB stick
-----------------------------------------

1. On GitHub, open Actions, then "kaast2-desktop", then the latest green run.
2. Download the artefact named "kaast2-usb-kit-v..." and unzip it.
3. Copy the whole "KAAST 2 v... - USB kit" folder to the USB stick.
   (The Windows installers are about 210 MB each, because they carry the
   Microsoft WebView2 part. A 1 GB stick is enough.)
4. Optional: before you copy, check the fingerprints as described above.
