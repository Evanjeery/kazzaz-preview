#!/usr/bin/env bash
# Builds the static site into _site/: copies index.html, decodes small assets,
# downloads the 5 Pixabay hero clips (Pixabay Content License) and compresses them.
set -euo pipefail
OUT="${1:-_site}"
mkdir -p "$OUT/assets" "$OUT/media"
cp index.html "$OUT/index.html"
base64 -d assets/logo.b64 > "$OUT/assets/logo.webp"
base64 -d assets/favicon-32.b64 > "$OUT/assets/favicon-32.png"

tmp="$(mktemp -d)"
while read -r id url; do
  [ -z "$id" ] && continue
  curl -fL --retry 3 -e https://pixabay.com/ -A "Mozilla/5.0" -o "$tmp/$id.mp4" "$url"
  ffmpeg -nostdin -v error -y -i "$tmp/$id.mp4" -t 14 -an -vf "scale=-2:720,fps=24" \
    -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart "$OUT/media/hero-$id.mp4"
  ffmpeg -nostdin -v error -y -ss 2 -i "$tmp/$id.mp4" -frames:v 1 -vf scale=960:-1 -c:v libwebp -q:v 60 "$OUT/media/hero-$id.webp"
done < media/sources.txt
ls -l "$OUT/media"; du -ch "$OUT"/media/*.mp4 | tail -1
