import redis
import os
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import pkcs12
import tempfile

def extract_pfx_to_pem(pfx_path, pfx_password):
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

# Try to connect with client certificates if PFX is provided
if pfx_path and pfx_pw:
    try:
        cert_pem, key_pem = extract_pfx_to_pem(pfx_path, pfx_pw)
        
        # Write to temporary files
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.pem', delete=False) as cert_file:
            cert_file.write(cert_pem)
            cert_path = cert_file.name

        with tempfile.NamedTemporaryFile(mode='wb', suffix='.pem', delete=False) as key_file:
            key_file.write(key_pem)
            key_path = key_file.name
        
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

        connection.set("bar", "bar")
        print("Connected with client certificate authentication")
        print(f"print connection: {connection.get("bar")}")
    except Exception as e:
        print(f"Failed to use client certificates: {e}")
        print("Falling back to server-only SSL...")
        connection = redis.Redis(
            host=env_variables["host"],
            port=env_variables["port"],
            username=env_variables["username"],
            password=env_variables["password"],
            ssl=True,
            ssl_ca_certs=env_variables["pem-path"]
        )
        # TODO - Display an error here and maybe exit app? 
else:
    # Connect with server certificate validation only
    # TODO display something here if we succeed/fail
    connection = redis.Redis(
        host=env_variables["host"],
        port=env_variables["port"],
        username=env_variables["username"],
        password=env_variables["password"],
        ssl=True,
        ssl_ca_certs=env_variables["pem-path"]
    )
    print("Connected with server certificate validation only")