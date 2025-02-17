import sys
import os
from app import app 

path = "/home/Educationlife/src"
if path not in sys.path:
    sys.path.append(path)

os.chdir(path)
application = app