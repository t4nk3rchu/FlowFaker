STRINGS = {
    "en": {
        "usage_title": "Usage: faker <provider> [repeat=N] [newline] [locale=xx]",
        "usage_sub": "Example: faker email repeat=3 newline locale=en_US",
        "copied": "Copied to clipboard",
        "clipboard_unavailable": "Clipboard not available",
        "invalid_provider": "is not a valid Faker provider.",
        "suggestions": "Did you mean one of these?",
        "copy_options": "Press → for copy options",
        "copy_single": "Copy to clipboard",
        "copy_newline": "Copy to clipboard, newline-separated",
        "copy_comma": "Copy to clipboard, comma-separated",
        "copy_space": "Copy to clipboard, space-separated",
        "copy_json": "Copy to clipboard, JSON format",
    }
}

def t(lang: str, key: str) -> str:
    d = STRINGS.get(lang, STRINGS["en"]) 
    return d.get(key, key)