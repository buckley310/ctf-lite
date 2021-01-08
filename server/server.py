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
    # give a positive, signed, 64-bit integer
    return randbelow(1 << 63)


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
    try:
        auth = jwt.decode(request.headers['X-Sesid'],
                          jwt_secret,
                          algorithms=['HS256'])
    except:
        return None
    return db.users.find_one({'_id': ObjectId(auth['userid'])})


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

    u = db.users.find_one({'username': args['username']})

    if not u:
        bcrypt.hashpw(b'no timing attacks', bcrypt.gensalt())
        return jsonify({'txt': 'Incorrect'})

    if not bcrypt.checkpw(args['password'].encode('utf8'),
                          u['password'].encode('utf8')):
        return jsonify({'txt': 'Incorrect'})

    token = jwt.encode({'userid': str(u['_id'])},
                       jwt_secret,
                       algorithm='HS256')

    return jsonify({"sesid": token.decode('utf8')})


@app.route("/userinfo")
def OtherUserInfo():
    checkStr(request.args['uid'])
    try:
        uid = ObjectId(request.args['uid'])
    except:
        return jsonify({'ok': False, 'txt': 'Invalid userId'})

    u = db.users.find_one(
        {'_id': uid},
        {'password': 0, 'email': 0}
    )
    if not u:
        return jsonify({'ok': False, 'txt': 'User not found'})

    u['_id'] = str(u['_id'])
    cscores = get_challenge_scores()
    u['score'] = sum(cscores.get(x, 0) for x in u['solves'])
    assert set(u.keys()) == set(
        ['_id', 'username', 'lastSolveTime', 'solves', 'score']
    )
    return jsonify({'ok': True, 'data': u})


@app.route("/myuserinfo")
def MyUserInfo():
    u = get_user_record()
    if not u:
        return jsonify(False)
    u['_id'] = str(u['_id'])
    del u['password']
    cscores = get_challenge_scores()
    u['score'] = sum(cscores.get(x, 0) for x in u['solves'])
    assert set(u.keys()) in [
        set(['_id', 'username', 'lastSolveTime', 'solves', 'score']),
        set(['_id', 'username', 'lastSolveTime', 'solves', 'score', 'email'])
    ]
    return jsonify(u)


@app.route("/setpassword", methods=['POST'])
def setpassword():
    u = get_user_record()
    assert u

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
    assert u

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
    assert u

    args = request.get_json()
    checkStr(args['flag'])

    c = db.challenges.find_one({'flag': args['flag']})
    if not c:
        return jsonify({'ok': False, 'msg': "Unknown flag."})

    if str(c['_id']) in u['solves']:
        return jsonify({'ok': False, 'msg': "You've already solved that one."})

    db.users.update_one(
        {'_id': u['_id']},
        {
            "$set": {"lastSolveTime": int(time())},
            "$push": {"solves": str(c['_id'])},
        })

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

    if db.users.find_one({'username': args['username']}):
        return jsonify({'ok': False, 'txt': 'Username already taken'})

    hashed = bcrypt.hashpw(args['password'].encode('utf8'), bcrypt.gensalt())

    db.users.insert_one({
        'username': args['username'],
        'password': hashed.decode('utf8'),
        'lastSolveTime': 0, 'solves': [],
    })
    return jsonify({'ok': True})


@app.route("/challenges")
def challenges():
    chals = [
        {
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
