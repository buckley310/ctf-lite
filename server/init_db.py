#!/usr/bin/env python3

import pymongo

db = pymongo.MongoClient('mongodb://127.0.0.1:27017')['ctf']

db['challenges'].insert_many([
    {
        'title': 'a', 'category': 'web', 'points': 10, 'flag': 'flag{a}',
        'text': 'foo'
    },
    {
        'title': 'b', 'category': 'web', 'points': 10, 'flag': 'flag{b}',
        'text': 'bar'
    },
    {
        'title': 'c', 'category': 'web', 'points': 10, 'flag': 'flag{c}',
        'text': 'baz'
    },
    {
        'title': 'd', 'category': 'web', 'points': 10, 'flag': 'flag{d}',
        'text': 'boo'
    },
    {
        'title': 'e', 'category': 'pwn', 'points': 10, 'flag': 'flag{e}',
        'text': 'bob'
    },
    {
        'title': 'f', 'category': 'pwn', 'points': 10, 'flag': 'flag{f}',
        'text': 'boot'
    },
])
