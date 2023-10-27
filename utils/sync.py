#!/usr/bin/env python3

from argparse import ArgumentParser
from base64 import b64encode
from pathlib import Path
from requests import Session

args = None
sess = Session()


def sendfile(file: Path) -> None:
    print(f"Sending {file}")
    data = b64encode(file.read_bytes())

    # Send it to Bitburner
    sess.post(args.url, json={
        "code": data.decode(),
        "filename": str(file.relative_to(args.path)),
    })


def copy_to() -> None:
    for i in Path(args.path).glob("**/*"):
        if not i.is_dir():
            sendfile(i)


if __name__ == "__main__":
    parser = ArgumentParser(prog="sync", description="Sync files from/to bitburner game")
    parser.add_argument(
        "--url", default="http://localhost:9990/", type=str,
        help="Set bitburner listenning URL"
    )
    parser.add_argument(
        "--to", default=copy_to, action="store_const",
        dest="action", help="Copy tree to bitburner game (default)"
    )
    parser.add_argument("api_key", type=str)
    parser.add_argument("path", type=str, default=".")
    args = parser.parse_args()

    # Create the session and add the Authorization header
    sess.headers["Authorization"] = f"Bearer {args.api_key}"
    args.action()
