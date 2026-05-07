import google.generativeai as genai

genai.configure(api_key="AIzaSyDog8h6Maaz5Kxu6fIW3c1KAA7Zj2qpIjU")

try:
    print("Available models for your key:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"-> {m.name}")
except Exception as e:
    print(f"Error: {e}")