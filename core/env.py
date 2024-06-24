import os

from dotenv import load_dotenv

from mars.backend.mars import Mars

load_dotenv()
try:
    PRINTSERVER_HOST = os.getenv("PRINTERVER_HOST")
    PRINT_PORT = os.getenv("PRINT_PORT")
    mars_connection = Mars(
        url=os.getenv("MARS_URL"),
        username=os.getenv("MARS_USERNAME"),
        password=os.getenv("MARS_PASSWORD"),
        token=os.getenv("MARS_TOKEN"),
        client_id=os.getenv("MARS_CLIENT_ID"),
    )
finally:
    pass


# IDAM create in users.IDAM coz it usless outside of aplication
