import os

from dotenv import load_dotenv

from mars.backend.mars import Mars

load_dotenv()

PRINTSERVER_HOST = os.getenv("PRINTERVER_PORT")
PRINT_PORT = os.getenv("PRINT_PORT")
mars_connection = Mars(
    username=os.getenv("MARS_USERNAME"),
    password=os.getenv("MARS_PASSWORD"),
    token=os.getenv("MARS_TOKEN"),
    client_id=os.getenv("MARS_CLIENT_ID"),
)
