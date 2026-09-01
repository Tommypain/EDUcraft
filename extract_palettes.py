import json

# Let's read the 60 palettes from src/App.jsx so we have all of them
with open('/home/tommypain/Projects/EDUcraft/src/App.jsx', 'r', encoding='utf-8') as f:
    app_jsx = f.read()

palettes_start = app_jsx.find('const THIQA_PALETTES = [')
palettes_end = app_jsx.find('];', palettes_start) + 2
palettes_js = app_jsx[palettes_start:palettes_end]

print("Found THIQA_PALETTES, length:", len(palettes_js))
