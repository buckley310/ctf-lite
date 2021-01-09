#!/usr/bin/env python3

from secrets import token_hex
from random import random
from database import User, Challenge, Solve, DbSession


def rand_chal(cat):
    t = token_hex(2+int(random()*8))
    return Challenge(
        title=t,
        flag=t,
        category=cat,
        points=int(random()*100),
        text=' '.join([token_hex(int(random()*12)) for _ in range(10)]),
    )


s = DbSession()

for cat in ['web', 'crypto', 'pwn', 'programming', 'forensics']:
    for n in range(int(4+4*random())):
        s.add(rand_chal(cat))

s.commit()
