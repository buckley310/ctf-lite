#!/usr/bin/env python3

from os import urandom, environ as env

SERVER_NAME = env['CTF_SERVER_NAME']

DB_PATH = env['CTF_DB_PATH']

SECRET_KEY = env['CTF_SECRET_KEY'] if 'CTF_SECRET_KEY' in env else urandom(32)


DISCORD_CLIENT_ID = env['CTF_DISCORD_CLIENT_ID']
DISCORD_CLIENT_SECRET = env['CTF_DISCORD_CLIENT_SECRET']
