
import bcrypt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

password = "password123"
print(f"Password: {password}")

# Direct Bcrypt
try:
    hashed_raw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    print(f"Raw Bcrypt Hash: {hashed_raw}")
    
    # Verify with passlib
    verified = pwd_context.verify(password, hashed_raw)
    print(f"Passlib Verification of Raw Hash: {verified}")
    
except Exception as e:
    print(f"Raw Bcrypt Failed: {e}")
    import traceback
    traceback.print_exc()

# Passlib Hashing (Control Group - known to fail)
try:
    hashed_passlib = pwd_context.hash(password)
    print(f"Passlib Hash: {hashed_passlib}")
except Exception as e:
    print(f"Passlib Hashing Failed: {e}")
