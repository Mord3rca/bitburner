#!/usr/bin/env python3

import os
import sys
import json
from base64 import b64decode


def usage(error=None):
	if(error):
		print(error, file=sys.stderr)
	exit(f"Usage: {sys.argv[0]} <save-file>")


if __name__ == "__main__":
	if(len(sys.argv) != 2):
		usage()

	# Go to the root git directory
	os.chdir(os.path.join(os.path.dirname(sys.argv[0]), '..'));

	try:
		with open(sys.argv[1], 'rb') as f:
			data = json.loads(b64decode(f.read()))

	except:
		usage("File not found or invalid content")

	js = json.loads(data["data"]["AllServersSave"])

	for i in js["home"]["data"]["scripts"]:
		code = i["data"]["code"]
		filename = i["data"]["filename"].lstrip('/')
		dirname = os.path.dirname(filename)

		if len(dirname) > 0 and not os.path.exists(dirname):
			print(f"* Creating {dirname} folder...")
			os.makedirs(dirname)

		with open(filename, 'w') as f:
			print(f"* Writting {filename}...")
			f.write(code)
