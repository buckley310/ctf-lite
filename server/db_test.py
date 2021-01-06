#!/usr/bin/env python3

import secrets
from database import User, Challenge, Solve, DbSession


def rand_id():
    # give a positive, signed, 64-bit integer
    return secrets.randbelow(1 << 63)


c = Challenge(title='foo')
u = User(id=rand_id(), name='john smith')

s = DbSession()

s.add(c)
s.commit()  # hydrate c.id
s.add(u)
s.add(Solve(user=u.id, challenge=c.id))
s.commit()

for x in s.query(Solve).filter_by(user=u.id).all():
    ctitle = s.query(Challenge).filter_by(id=x.challenge).one().title
    print('user', x.user, 'solved', ctitle)
