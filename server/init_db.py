#!/usr/bin/env python3

from secrets import token_hex
from random import random
from database import User, Challenge, DbSession

s = DbSession()

for cat in ['web', 'crypto', 'pwn', 'programming', 'forensics']:
    for n in range(int(4+4*random())):
        t = token_hex(2+int(random()*8))
        s.add(Challenge(
            title=t,
            flag=f'flag{{{t}}}',
            category=cat,
            points=int(random()*100),
            text=' '.join([token_hex(int(random()*12)) for _ in range(10)]),
        ))

s.commit()
