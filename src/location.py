def streetAddress(fake, options: dict) -> str:
    return fake.street_address()

def state(fake, options: dict) -> str:
    return fake.state()

def city(fake, options: dict) -> str:
    return fake.city()

def handle(subtype: str, fake, options: dict) -> str:
    m = (subtype or "").lower()
    if m == "streetaddress":
        return streetAddress(fake, options)
    if m == "state":
        return state(fake, options)
    if m == "city":
        return city(fake, options)
    raise ValueError(f"Unknown location subtype: {subtype}")