#!/usr/bin/env python3

import os
import sys
import glob
import requests
from base64 import b64encode


def usage():
	exit(f"Usage: {sys.argv[0]} [API Key]")


def sendfile(filename: str) -> None:
	print(f"Sending {filename}")
	# Read the content and encode it in base64
	with open(filename, 'rb') as f:
		data = b64encode(f.read())

	# Send it to Bitburner
	c.post("http://localhost:9990/",
		json={
			"filename": filename,
			"code": data.decode(),
		})


if __name__ == "__main__":
	if(len(sys.argv) != 2):
		usage()

	# Go to the root git directory
	os.chdir(os.path.join(os.path.dirname(sys.argv[0]), '..'));

	# Create the session and add the Authorization header
	c = requests.Session()
	c.headers["Authorization"] = f"Bearer {sys.argv[1]}"

	for i in ['js', 'ns', 'txt']:
		for j in glob.glob(f"./**/*.{i}", recursive=True):
			sendfile(j.lstrip('./'))
