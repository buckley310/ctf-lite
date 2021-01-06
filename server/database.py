#!/usr/bin/env python3

from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

Base = declarative_base()
engine = create_engine("sqlite:////tmp/test.db", echo=False)


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(Text(), nullable=False)


class Challenge(Base):
    __tablename__ = 'challenges'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text)
    text = Column(Text)
    flag = Column(Text)
    category = Column(Text)
    points = Column(Integer)


class Solve(Base):
    __tablename__ = 'solves'
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    user = Column(Integer, ForeignKey('users.id'), nullable=False)
    challenge = Column(Integer, ForeignKey('challenges.id'), nullable=False)


Base.metadata.create_all(engine)
DbSession = sessionmaker(bind=engine)
