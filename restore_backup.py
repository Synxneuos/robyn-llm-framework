import os
import shutil

src_backup = r"c:\Users\Naquib\Documents\antigravity\amazing-kepler\robyn-llm-framework\backups\web-app-elizaos-stable"
target_webapp = r"c:\Users\Naquib\Documents\antigravity\amazing-kepler\robyn-llm-framework\web-app"

print("Restoring web-app from locked backup...")
for item in os.listdir(src_backup):
    s = os.path.join(src_backup, item)
    d = os.path.join(target_webapp, item)
    if os.path.isdir(s):
        if os.path.exists(d):
            shutil.rmtree(d)
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

print("SUCCESS: Web application restored perfectly to locked ElizaOS version!")
