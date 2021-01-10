#!/usr/bin/env python3

from os import urandom, environ as env


DB_PATH = env['CTF_DB_PATH']

JWT_SECRET = env['CTF_JWT_SECRET'] if 'CTF_JWT_SECRET' in env else urandom(32)
