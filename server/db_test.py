#!/usr/bin/env python3

import secrets
from database import User, Challenge, DbSession


def rand_id():
    # give a positive, signed, 64-bit integer
    return secrets.randbelow(1 << 63)


u = User(id=rand_id(), name='john smith')

u.solves.append(Challenge(title='foo'))
u.solves.append(Challenge(title='bar'))

s = DbSession()
s.add(u)
s.commit()

for x in s.query(User).all():
    print(
        'user', x.name,
        'solved: [', ', '.join([y.title for y in x.solves]), ']'
    )
