import redis
from redis import Redis
import os
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import pkcs12
import tempfile

def extract_pfx_to_pem(pfx_path: str, pfx_password: str) -> bytes | bytes:
    """Extract certificate and private key from PFX file using cryptography library"""

    with open(pfx_path, 'rb') as pfx_file:
        pfx_data = pfx_file.read()
    
    # Load PKCS12 data
    private_key, certificate, additional_certificates = pkcs12.load_key_and_certificates(
        pfx_data, 
        pfx_password.encode() if pfx_password else None
    )
    
    # Serialize certificate to PEM format
    cert_pem = certificate.public_bytes(serialization.Encoding.PEM)
    
    # Serialize private key to PEM format
    key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    return cert_pem, key_pem


def test_redis_connection(connection: Redis) -> bool:  
    try:
        connection.ping()
        return True
    except:
        return False

# Your environment variables
pfx_path = os.environ.get("WF_REDIS_PFX_PATH")
pfx_pw = os.environ.get("WF_REDIS_PFX_PW")
env_variables = {
    "host": os.environ.get("WF_REDIS_CONNECTION_STRING"),
    "username": os.environ.get("REDIS_USERNAME"),
    "password": os.environ.get("REDIS_PASSWORD"),
    "pem-path": os.environ.get("WF_REDIS_SERVER_PEM_PATH"),
    "port": os.environ.get("REDIS_PORT")
}

def server_only_connection() -> Redis:
    print("Falling back to server-only SSL...")
    
    # TODO add retry logic here...
    connection = redis.Redis(
        host=env_variables["host"],
        port=env_variables["port"],
        username=env_variables["username"],
        password=env_variables["password"],
        ssl=True,
        ssl_ca_certs=env_variables["pem-path"],
        ssl_check_hostname=False                     
    )
    if test_redis_connection(connection):
        print("Connected with client certificate authentication")
        return connection
    else:
        print("Connection with certificate fail. Exiting application...")
        exit(1)


def client_cert_connection() -> Redis:
    """Create client certificate connection"""
    print("Attempting client certificate connection...")
    cert_pem, key_pem = extract_pfx_to_pem(pfx_path, pfx_pw)
    
    # Write to temporary files
    with tempfile.NamedTemporaryFile(mode='wb', suffix='.pem', delete=False, delete_on_close=True) as cert_file:
        cert_file.write(cert_pem)
        cert_path = cert_file.name
    
    with tempfile.NamedTemporaryFile(mode='wb', suffix='.pem', delete=False, delete_on_close=True) as key_file:
        key_file.write(key_pem)
        key_path = key_file.name
    
    # TODO - Add retry logic here...
    connection = redis.Redis(
        host=env_variables["host"],
        port=env_variables["port"],
        username=env_variables["username"],
        password=env_variables["password"],
        ssl=True,
        ssl_ca_certs=env_variables["pem-path"],
        ssl_certfile=cert_path,
        ssl_keyfile=key_path,
        ssl_check_hostname=False
    )
    
    if test_redis_connection(connection):
        print("Successfully connected with client certificate authentication")
        return connection
    else:
        print("Client certificate connection failed")
        raise Exception("Client certificate connection failed")

# Main connection logic
def connect_redis() -> Redis:
    if pfx_path and pfx_pw:
        try:
            return client_cert_connection()
        except Exception as e:
            print(f"Client cert failed: {e}")
            return server_only_connection()
    else:
        return server_only_connection()
