#!/usr/bin/env python3

from sqlalchemy import create_engine, Column, ForeignKey, Integer, Text, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship

Base = declarative_base()
engine = create_engine("sqlite:////tmp/test.db", echo=False)

solves = Table(
    'solves', Base.metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('challenge_id', Integer, ForeignKey('challenges.id')),
)


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(Text(), nullable=False)
    lastSolveTime = Column(Integer, nullable=False)
    solves = relationship(
        'Challenge', secondary=solves, back_populates="solvers")


class Challenge(Base):
    __tablename__ = 'challenges'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text, nullable=False)
    text = Column(Text, nullable=False)
    flag = Column(Text, nullable=False)
    category = Column(Text, nullable=False)
    points = Column(Integer, nullable=False)
    solvers = relationship(
        'User', secondary=solves, back_populates="solves")


Base.metadata.create_all(engine)
DbSession = scoped_session(sessionmaker(bind=engine))
