#!/usr/bin/env python3

import secrets
from database import User, Challenge, DbSession


def rand_id():
    # give a positive, signed, 64-bit integer
    return secrets.randbelow(1 << 63)


def gen_chal(title):
    return Challenge(
        title=title,
        points=10,
        text='asdfg',
        flag='flag[1234]',
        category='web',
    )


s = DbSession()

u = User(id=rand_id(), name='john smith', lastSolveTime=3)

u.solves.append(gen_chal('foo'))
u.solves.append(gen_chal('bar'))

s.add(u)
s.add(gen_chal('boo'))
s.commit()

for x in s.query(User).all():
    print(
        'user', x.name,
        'solved: [', ', '.join([y.title for y in x.solves]), ']'
    )
