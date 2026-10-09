from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("https://ykyiomtthjuujbkfetje.supabase.co")
key = os.getenv("sb_publishable_g2bf4apJEXzMv3ydwbHU3A_DCyXHrSd")

supabase: Client = create_client(url, key)