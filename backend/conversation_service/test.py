import hashlib

print(hashlib.sha256("first_user.second_user".encode()).hexdigest())
