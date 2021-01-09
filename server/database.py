#!/usr/bin/env python3

from time import time
from sqlalchemy import create_engine, Column, ForeignKey, Integer, Text, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from config import database_path

Base = declarative_base()
engine = create_engine(database_path, echo=False)


class Solve(Base):
    __tablename__ = 'solves'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user = Column(Integer, ForeignKey('users.id'))
    challenge = Column(Integer, ForeignKey('challenges.id'))
    timestamp = Column(Integer, default=lambda: int(time()))


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(Text(), nullable=False, unique=True)
    password = Column(Text(), nullable=False)
    email = Column(Text())


class Challenge(Base):
    __tablename__ = 'challenges'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text, nullable=False)
    text = Column(Text, nullable=False)
    flag = Column(Text, nullable=False)
    category = Column(Text, nullable=False)
    points = Column(Integer, nullable=False)


Base.metadata.create_all(engine)
DbSession = scoped_session(sessionmaker(bind=engine))
