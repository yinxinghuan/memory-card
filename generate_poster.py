#!/usr/bin/env python3
"""Generate Memory Card game poster via ComfyUI Flux2 Klein."""
import json, time, random, sys, os
import urllib.request, urllib.parse

BASE = "http://127.0.0.1:8188"
OUT  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/MemoryCard/img/poster.png")

PROMPT = (
    "epic mobile game poster art, perfect square composition, "
    "dozens of glowing magical playing cards exploding outward from the center in all directions, "
    "cards spinning and flying dramatically through the air, "
    "each card glows with bright neon purple and blue energy, golden card edges, "
    "deep dark cosmic background with stars and nebula, "
    "brilliant purple and blue light rays radiating from the center explosion, "
    "magical sparkles and particle effects, volumetric god rays, "
    "cinematic wide-angle dramatic perspective, ultra vibrant saturated colors, "
    "photorealistic render, 8k sharp detail, "
    'large bold white text "FLIP & MATCH" at the very top of the image, '
    "letters outlined with bright purple neon glow, professional game cover art typography"
)

SEED = random.randint(0, 2**31)

WORKFLOW = {
    "1": {"class_type": "UNETLoader",           "inputs": {"unet_name": "flux-2-klein-4b.safetensors", "weight_dtype": "default"}},
    "2": {"class_type": "CLIPLoader",            "inputs": {"clip_name": "qwen_3_4b.safetensors", "type": "flux2"}},
    "3": {"class_type": "VAELoader",             "inputs": {"vae_name": "flux2-vae.safetensors"}},
    "4": {"class_type": "CLIPTextEncode",        "inputs": {"text": PROMPT, "clip": ["2", 0]}},
    "5": {"class_type": "ConditioningZeroOut",   "inputs": {"conditioning": ["4", 0]}},
    "6": {"class_type": "CFGGuider",             "inputs": {"model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0], "cfg": 1.0}},
    "7": {"class_type": "RandomNoise",           "inputs": {"noise_seed": SEED}},
    "8": {"class_type": "EmptyFlux2LatentImage", "inputs": {"width": 1024, "height": 1024, "batch_size": 1}},
    "9": {"class_type": "Flux2Scheduler",        "inputs": {"steps": 4, "width": 1024, "height": 1024}},
    "10":{"class_type": "KSamplerSelect",        "inputs": {"sampler_name": "euler"}},
    "11":{"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["7",0], "guider": ["6",0], "sampler": ["10",0], "sigmas": ["9",0], "latent_image": ["8",0]}},
    "12":{"class_type": "VAEDecode",             "inputs": {"samples": ["11",0], "vae": ["3",0]}},
    "13":{"class_type": "SaveImage",             "inputs": {"images": ["12",0], "filename_prefix": "mc_poster"}},
}

def api_post(path, data):
    body = json.dumps(data).encode()
    req  = urllib.request.Request(f"{BASE}{path}", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())

def api_get(path):
    with urllib.request.urlopen(f"{BASE}{path}", timeout=30) as r:
        return json.loads(r.read())

print(f"Generating poster (seed={SEED})…")
resp = api_post("/prompt", {"prompt": WORKFLOW})
pid  = resp["prompt_id"]
print(f"  prompt_id={pid[:8]}…")

start = time.time()
while time.time() - start < 600:
    time.sleep(3)
    hist = api_get(f"/history/{pid}")
    if pid in hist:
        entry = hist[pid]
        if entry.get("status", {}).get("status_str") == "error":
            for m in entry["status"].get("messages", []):
                if m[0] == "execution_error":
                    print("Error:", m[1].get("exception_message"))
                    sys.exit(1)
        if entry.get("outputs"):
            elapsed = int(time.time() - start)
            print(f"  Done in {elapsed}s")
            for node_out in entry["outputs"].values():
                for img in node_out.get("images", []):
                    params = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img.get("subfolder",""), "type": img.get("type","output")})
                    urllib.request.urlretrieve(f"{BASE}/view?{params}", OUT)
                    print(f"  Saved → {OUT}")
                    sys.exit(0)
    print(f"  … {int(time.time()-start)}s", flush=True)

print("Timed out"); sys.exit(1)
