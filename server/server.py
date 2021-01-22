#!/usr/bin/env python3

import os
import jwt
import json
import bcrypt
import bisect
from base64 import b64encode, b64decode
from collections import deque, Counter
from time import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from threading import Lock
from database import User, Challenge, Solve, DbSession as db

from authlib.integrations.flask_client import OAuth
from loginpass import create_flask_blueprint, Discord

app = Flask(__name__)
app.config.from_pyfile('config.py')
CORS(app)
rateLimit = deque(maxlen=64)
statsLock = Lock()


def handle_authorize(remote, token, user_info):
    if not user_info:
        # TODO: why did we get here?
        assert False
        return ''

    # TODO: discord IDs are all numbers, but other backends may be alphanum?
    try:
        u = db.query(User).filter_by(id=int(user_info['sub'])).one()
        if user_info['name'] != u.name or user_info['email'] != u.email:
            u.name = user_info['name']
            if user_info['email_verified']:
                u.email = user_info['email']
            db.commit()
    except:
        u = User(
            id=int(user_info['sub']),
            name=user_info['name'],
            email=user_info['email'] if user_info['email_verified'] else None
        )
        db.add(u)
        db.commit()

    token = jwt.encode({'userid': u.id},
                       app.config['SECRET_KEY'],
                       algorithm='HS256')

    return f'''
        <!DOCTYPE HTML>
        <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body>
                <script>
                    window.opener.postMessage(
                        "{token}",
                        "https://ctf.devstuff.site"
                    );
                    window.close();
                </script>
            </body>
        </html>
    '''


oauth = OAuth(app)
bp = create_flask_blueprint([Discord], oauth, handle_authorize)
app.register_blueprint(bp, url_prefix='')


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
                db.query(Solve).filter_by(challenge=chal.id).count()
            )
            for chal in db.query(Challenge)
        ])

        cscores = get_challenge_scores()
        board = []
        for u in db.query(User):
            score = sum(
                cscores.get(x.challenge, 0) for x in
                db.query(Solve).filter_by(user=u.id)
            )
            bisect.insort(board, (-score,
                                  max([
                                      x.timestamp for x in
                                      db.query(Solve).filter_by(user=u.id)
                                  ] + [0]),
                                  u.name,
                                  u.id))
            while len(board) > 10 and board[-1][0] != board[-2][0]:
                board.pop()
        print(board)
        scoreboard = [
            {'username': n, 'score': -s, '_id': i}
            for s, _, n, i in board
        ]


def get_user_record():
    auth = jwt.decode(request.headers['X-Sesid'],
                      app.config['SECRET_KEY'],
                      algorithms=['HS256'])
    return db.query(User).filter_by(id=auth['userid']).one()


def get_challenge_scores():
    return dict([
        (x.id, x.points)
        for x in db.query(Challenge)
    ])


@app.route("/userinfo")
def OtherUserInfo():
    try:
        u = db.query(User).filter_by(id=int(request.args['uid'])).one()
    except:
        return jsonify({'ok': False, 'txt': 'User not found'})

    usolves = db.query(Challenge).filter(
        Challenge.id.in_([
            x.challenge for x in
            db.query(Solve).filter_by(user=u.id)
        ])
    )

    return jsonify({'ok': True, 'data': {
        '_id': u.id,
        'username': u.name,
        'solves': [x.id for x in usolves],
        'score': sum(x.points for x in usolves),
    }})


@app.route("/myuserinfo")
def MyUserInfo():
    try:
        u = get_user_record()
    except:
        return jsonify(False)

    usolves = db.query(Challenge).filter(
        Challenge.id.in_([
            x.challenge for x in
            db.query(Solve).filter_by(user=u.id)
        ])
    )

    return jsonify({
        '_id': u.id,
        'username': u.name,
        'solves': [x.id for x in usolves],
        'score': sum(x.points for x in usolves),
        'email': u.email,
    })


@app.route("/submitflag", methods=['POST'])
def submitflag():
    u = get_user_record()

    args = request.get_json()
    checkStr(args['flag'])

    try:
        c = db.query(Challenge).filter_by(flag=args['flag']).one()
    except:
        return jsonify({'ok': False, 'msg': "Unknown flag."})

    if db.query(Solve).filter_by(user=u.id, challenge=c.id).count():
        return jsonify({'ok': False, 'msg': "You've already solved that one."})

    db.add(Solve(user=u.id, challenge=c.id))
    db.commit()

    calcStats()
    return jsonify({'ok': True, 'msg': 'Nice job!'})


@app.route("/scoreboard")
def getScoreboard():
    return jsonify(scoreboard)


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


class ReverseProxied(object):
    # https://web.archive.org/web/20190623105727/http://flask.pocoo.org/snippets/35/
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)


if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.wsgi_app = ReverseProxied(app.wsgi_app)  # force HTTPS scheme
    app.run(host='0.0.0.0', port=5000)
