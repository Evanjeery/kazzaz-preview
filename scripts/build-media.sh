#!/usr/bin/env bash
# Builds the static site into _site/: copies index.html, decodes small assets,
# downloads the Pixabay and Pexels hero clips (Pixabay Content License) and compresses them.
set -euo pipefail
OUT="${1:-_site}"
mkdir -p "$OUT/assets" "$OUT/media"
cp index.html about.html careers.html profile-hero.svg profile-team.svg kazzaz-ui.js lang-bundle-*.json "$OUT/"
base64 -d assets/logo.b64 > "$OUT/assets/logo.webp"
base64 -d assets/favicon-32.b64 > "$OUT/assets/favicon-32.png"

tmp="$(mktemp -d)"
while read -r id url; do
  [ -z "$id" ] && continue
  curl -fL --retry 3 -e https://pixabay.com/ -A "Mozilla/5.0" -o "$tmp/$id.mp4" "$url"
  ffmpeg -nostdin -v error -y -i "$tmp/$id.mp4" -t 14 -an -vf "scale=-2:720,fps=24" \
    -c:v libx264 -preset slow -crf 29 -maxrate 900k -bufsize 1800k -pix_fmt yuv420p -movflags +faststart "$OUT/media/hero-$id.mp4"
  ffmpeg -nostdin -v error -y -ss 2 -i "$tmp/$id.mp4" -frames:v 1 -vf scale=960:-1 -c:v libwebp -q:v 60 "$OUT/media/hero-$id.webp"
done < media/sources.txt
ls -l "$OUT/media"; du -ch "$OUT"/media/*.mp4 | tail -1

# Real fire footage for the flame sweep (Mixkit Stock Video Free License, flames on black, no audio), 540p, 6 s
curl -fL --retry 3 -A "Mozilla/5.0" -o "$tmp/fire.mp4" https://assets.mixkit.co/videos/3753/3753-720.mp4
ffmpeg -nostdin -v error -y -ss 1 -t 6 -i "$tmp/fire.mp4" -an -vf "scale=-2:540,fps=24" -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart "$OUT/media/fire.mp4"

# Background music: 22 Pixabay tracks (non-AI, checked), trimmed to 150 s (Pixabay Content License), loudness-normalised, 64 kbps mp3
while read -r id url; do
  [ -z "$id" ] && continue
  curl -fL --retry 3 -e https://pixabay.com/ -A "Mozilla/5.0" -o "$tmp/m-$id.mp3" "$url"
  ffmpeg -nostdin -v error -y -i "$tmp/m-$id.mp3" -af loudnorm=I=-20:TP=-2:LRA=7 -t 150 -ar 44100 -c:a libmp3lame -b:a 64k "$OUT/media/music-$id.mp3"
done < media/music-sources.txt
# Track 17: audio supplied by the owner (stored as base64 text), exact segment, not trimmed
base64 -d assets/music-clip.b64 > "$OUT/media/music-clip.mp3"
du -ch "$OUT"/media/music-*.mp3 | tail -1

# Category photos: 11 real Pixabay photos (Pixabay Content License), cropped to 4:3 and compressed to webp
while read -r id url; do
  [ -z "$id" ] && continue
  curl -fL --retry 3 -e https://pixabay.com/ -A "Mozilla/5.0" -o "$tmp/c-$id.jpg" "$url"
  ffmpeg -nostdin -v error -y -i "$tmp/c-$id.jpg" -vf "scale=640:480:force_original_aspect_ratio=increase,crop=640:480" -c:v libwebp -q:v 68 "$OUT/media/cat-$id.webp"
done < media/cat-sources.txt
du -ch "$OUT"/media/cat-*.webp | tail -1

# Own photos supplied by the owner (stored as base64 text, decoded here); these override the stock photos
for f in assets/cat-*-own.b64; do [ -e "$f" ] || continue; n=$(basename "$f" -own.b64); base64 -d "$f" > "$OUT/media/$n.webp"; done
for f in assets/gal-*.b64; do [ -e "$f" ] || continue; n=$(basename "$f" .b64); base64 -d "$f" > "$OUT/media/$n.webp"; done

cp logoanim.js "$OUT/media/logoanim.js"

# New hero clips supplied by the owner (portrait phone videos, stored as base64 text)
for f in assets/hero-u*.mp4.b64; do [ -e "$f" ] || continue; n=$(basename "$f" .b64); base64 -d "$f" > "$OUT/media/$n"; done
for f in assets/hero-u*.webp.b64; do [ -e "$f" ] || continue; n=$(basename "$f" .b64); base64 -d "$f" > "$OUT/media/$n"; done
