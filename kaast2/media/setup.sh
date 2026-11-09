#!/usr/bin/env bash
# One-time setup for rendering the media (Linux or macOS):
#  - Python packages: kokoro-onnx (voice), soundfile, scipy, numpy; faster-whisper (optional check)
#  - the Kokoro model files into media/.models/ (about 350 MB, not in git)
#  - ffmpeg and a TeX distribution must already be installed (brew install ffmpeg; MacTeX or texlive)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
pip install --quiet kokoro-onnx soundfile scipy numpy
mkdir -p "$here/.models"
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "$here/.models/$f" ] || curl -L --fail -o "$here/.models/$f" "$base/$f"
done
echo "media setup done"
