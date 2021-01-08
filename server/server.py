#!/usr/bin/env python3

import os
import jwt
import bcrypt
import bisect
from collections import deque, Counter
from time import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from threading import Lock
from secrets import randbelow
from database import User, Challenge, DbSession as db

app = Flask(__name__)
CORS(app)
rateLimit = deque(maxlen=64)
jwt_secret = os.urandom(32)
statsLock = Lock()


def rand_id():
    # give a positive number between 1 and javascript's MAX_SAFE_INTEGER
    return randbelow((1 << 53)-1)+1


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.remove()


@app.before_first_request
def start_db():
    calcStats()


def checkStr(*argv):
    for s in argv:
        # TODO: raise instead of assert
        assert isinstance(s, str)
        assert len(s)


def calcStats():
    global solveCounts
    global scoreboard

    print("RECALCULATING STATS")

    with statsLock:
        solveCounts = dict([
            (
                chal.id,
                db.query(User).filter(User.solves.contains(chal)).count()
            )
            for chal in db.query(Challenge)
        ])

        cscores = get_challenge_scores()
        board = []
        for u in db.query(User):
            score = sum(cscores.get(x.id, 0) for x in u.solves)
            bisect.insort(board, (-score,
                                  u.lastSolveTime,
                                  u.name,
                                  u.id))
            while len(board) > 10 and board[-1][0] != board[-2][0]:
                board.pop()
        scoreboard = [
            {'username': n, 'score': -s, '_id': i}
            for s, _, n, i in board
        ]


def get_user_record():
    auth = jwt.decode(request.headers['X-Sesid'],
                      jwt_secret,
                      algorithms=['HS256'])
    return db.query(User).filter_by(id=auth['userid']).one()


def get_challenge_scores():
    return dict([
        (x.id, x.points)
        for x in db.query(Challenge)
    ])


@app.route("/login", methods=['POST'])
def login():
    args = request.get_json()
    checkStr(args['username'], args['password'])

    # block brute force \/
    stamp = int(time()/10)
    rateLimit.append((stamp, args['username']))
    rateLimit.append((stamp, request.remote_addr))
    limitStats = Counter(rateLimit)
    if (limitStats[(stamp, args['username'])] > 5 or
            limitStats[(stamp, request.remote_addr)] > 5):
        return jsonify({'txt': 'Slow down, jeez'})
    # block brute force /\

    try:
        u = db.query(User).filter_by(name=args['username']).one()
    except:
        bcrypt.hashpw(b'no timing attacks', bcrypt.gensalt())
        return jsonify({'txt': 'Incorrect'})

    if not bcrypt.checkpw(args['password'].encode('utf8'), u.password):
        return jsonify({'txt': 'Incorrect'})

    token = jwt.encode({'userid': u.id},
                       jwt_secret,
                       algorithm='HS256')

    return jsonify({"sesid": token})


@app.route("/userinfo")
def OtherUserInfo():
    try:
        u = db.query(User).filter_by(id=int(request.args['uid'])).one()
    except:
        return jsonify({'ok': False, 'txt': 'User not found'})

    return jsonify({'ok': True, 'data': {
        '_id': u.id,
        'username': u.name,
        'lastSolveTime': u.lastSolveTime,
        'solves': [x.id for x in u.solves],
        'score': sum(x.points for x in u.solves),
    }})


@app.route("/myuserinfo")
def MyUserInfo():
    try:
        u = get_user_record()
    except:
        return jsonify(False)

    return jsonify({
        '_id': u.id,
        'username': u.name,
        'lastSolveTime': u.lastSolveTime,
        'solves': [x.id for x in u.solves],
        'score': sum(x.points for x in u.solves),
        'email': u.email,
    })


@app.route("/setpassword", methods=['POST'])
def setpassword():
    u = get_user_record()

    args = request.get_json()
    checkStr(args['oldpass'], args['newpass'])

    if not bcrypt.checkpw(args['oldpass'].encode('utf8'),
                          u['password'].encode('utf8')):
        return jsonify({'ok': False, 'txt': 'Incorrect old password'})

    newhash = bcrypt.hashpw(args['newpass'].encode('utf8'), bcrypt.gensalt())
    db.users.update_one(
        {'_id': u['_id']},
        {"$set": {"password": newhash.decode('utf8')}}
    )
    return jsonify({'ok': True})


@app.route("/setemail", methods=['POST'])
def setemail():
    u = get_user_record()

    args = request.get_json()
    checkStr(args['password'], args['email'])

    if not bcrypt.checkpw(args['password'].encode('utf8'),
                          u['password'].encode('utf8')):
        return jsonify({'ok': False, 'txt': 'Incorrect password'})

    db.users.update_one(
        {'_id': u['_id']},
        {"$set": {"email": args['email']}}
    )
    return jsonify({'ok': True})


@app.route("/submitflag", methods=['POST'])
def submitflag():
    u = get_user_record()

    args = request.get_json()
    checkStr(args['flag'])

    if not db.query(Challenge).filter_by(flag=args['flag']).count():
        return jsonify({'ok': False, 'msg': "Unknown flag."})

    c = db.query(Challenge).filter_by(flag=args['flag']).one()

    if c in u.solves:
        return jsonify({'ok': False, 'msg': "You've already solved that one."})

    u.solves.append(c)
    u.lastSolveTime = int(time())
    db.commit()

    calcStats()
    return jsonify({'ok': True, 'msg': 'Nice job!'})


@app.route("/scoreboard")
def getScoreboard():
    return jsonify(scoreboard)


@app.route("/newaccount", methods=['POST'])
def newaccount():
    args = request.get_json()
    checkStr(args['username'], args['password'])

    if len(args['username']) > 32:
        return jsonify({'ok': False, 'txt': 'Shorter name please'})

    if db.query(User).filter_by(name=args['username']).count():
        return jsonify({'ok': False, 'txt': 'Username already taken'})

    hashed = bcrypt.hashpw(args['password'].encode('utf8'), bcrypt.gensalt())

    db.add(User(
        id=rand_id(),
        name=args['username'],
        password=hashed,
        lastSolveTime=0,
        solves=[],
    ))
    db.commit()

    return jsonify({'ok': True})


@app.route("/challenges")
def challenges():
    chals = [
        {
            '_id': chal.id,
            'title': chal.title,
            'category': chal.category,
            'points': chal.points,
            'text': chal.text,
            'solves': solveCounts.get(chal.id, 0),
        }
        for chal in db.query(Challenge)
    ]
    return jsonify(chals)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
