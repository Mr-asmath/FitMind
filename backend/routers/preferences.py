from fastapi import APIRouter, HTTPException, Depends
import sqlite3
import json
from ..schemas import UserPreferences  # Now this relative import works

router = APIRouter(prefix="/api/user", tags=["user"])

def get_db():
    conn = sqlite3.connect('wellness.db')
    try:
        yield conn
    finally:
        conn.close()

@router.post("/update-preferences")
async def update_preferences(
    prefs: UserPreferences,
    db: sqlite3.Connection = Depends(get_db)
):
    # Your implementation here
    pass