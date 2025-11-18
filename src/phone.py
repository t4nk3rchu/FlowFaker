def number(fake, options: dict) -> str:
    style = options.get("style", "human")
    if style == "international":
        return "+" + fake.msisdn()
    return fake.phone_number()

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype
    if m == "number":
        return number(fake, options)
    return fake.msisdn()

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype
    if m == "number":
        return number(fake, options)
    return fake.phone_number()