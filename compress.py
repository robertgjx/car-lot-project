import os, subprocess, json

COMPRESSED_LOG = "compressed_files.json"

# Load list of already-compressed files
if os.path.exists(COMPRESSED_LOG):
    with open(COMPRESSED_LOG, "r") as f:
        already_done = set(json.load(f))
else:
    already_done = set()

newly_compressed = []

for root, dirs, files in os.walk('public/cars'):
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(root, file)
            if filepath not in already_done:
                subprocess.run(['sips', '-Z', '1200', '--setProperty', 'formatOptions', '75', filepath])
                newly_compressed.append(filepath)
                print(f"Compressed: {filepath}")

# Save updated log
with open(COMPRESSED_LOG, "w") as f:
    json.dump(list(already_done | set(newly_compressed)), f)

print(f"Done! Compressed {len(newly_compressed)} new files.")
