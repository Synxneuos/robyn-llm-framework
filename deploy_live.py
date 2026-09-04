import requests
import os
import zipfile
import io

TOKEN = 'nfp_HvjeGa6xL4p5KqgFGVwURh3fmfbpyMme70db'
SITE_ID = '7e4e329a-cc8c-42ae-98ec-988815b4f22a'
DIST_DIR = r'c:\Users\Naquib\Documents\antigravity\amazing-kepler\robyn-llm-framework\web-app\dist'

def deploy():
    print("Packing production assets from dist/ ...")
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, DIST_DIR)
                zipf.write(full_path, rel_path)

    zip_buffer.seek(0)
    zip_data = zip_buffer.read()

    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/zip'
    }

    print(f"Deploying {len(zip_data)} bytes to Netlify (Site ID: {SITE_ID})...")
    res = requests.post(
        f'https://api.netlify.com/api/v1/sites/{SITE_ID}/deploys',
        headers=headers,
        data=zip_data,
        timeout=60
    )

    if res.status_code in (200, 201):
        data = res.json()
        print(f"[OK] Deploy Success! URL: https://robynos.xyz (Deploy ID: {data.get('id')})")
    else:
        print(f"Deploy failed with status {res.status_code}: {res.text}")

if __name__ == '__main__':
    deploy()
