import random as pyrandom

def license(fake, options: dict) -> str:
    if hasattr(fake, "license_plate"):
        return fake.license_plate()
    letters = "ABCDEFGHJKLMNPRSTUVWXYZ"
    part1 = "".join(pyrandom.choice(letters) for _ in range(3))
    part2 = "".join(str(pyrandom.randint(0,9)) for _ in range(4))
    return f"{part1}-{part2}"

def vin(fake, options: dict) -> str:
    if hasattr(fake, "vin"):
        return fake.vin()
    letters = "ABCDEFGHJKLMNPRSTUVWXYZ"
    digits = "0123456789"
    charset = letters + digits
    return "".join(pyrandom.choice(charset) for _ in range(17))

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype
    if m == "license":
        return license(fake, options)
    if m == "vin":
        return vin(fake, options)
    return vin(fake, options)