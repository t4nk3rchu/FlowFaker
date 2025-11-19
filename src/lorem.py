def words(fake, options: dict) -> str:
    length = int(options.get("length", 5))
    return " ".join(fake.words(nb=length))

def slug(fake, options: dict) -> str:
    length = int(options.get("length", 3))
    return "-".join(fake.words(nb=length)).lower()

def sentence(fake, options: dict) -> str:
    length = int(options.get("length", 8))
    return fake.sentence(nb_words=length)

def paragraph(fake, options: dict) -> str:
    length = int(options.get("length", 3))
    return fake.paragraph(nb_sentences=length)

def handle(subtype: str, fake, options: dict) -> str:
    m = (subtype or "").lower()
    if m == "words":
        return words(fake, options)
    if m == "slug":
        return slug(fake, options)
    if m == "sentence":
        return sentence(fake, options)
    if m == "paragraph":
        return paragraph(fake, options)
    raise ValueError(f"Unknown lorem subtype: {subtype}")