import secrets

if __name__ == "__main__":
    secret_key = secrets.token_hex(32)
    print("Your JWT Secret Key:")
    print(secret_key) 