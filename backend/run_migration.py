from app import create_app, db
from sqlalchemy import text

app = create_app()
with app.app_context():
    # add columns only if they don't exist (SQLite)
    insp = db.inspect(db.engine)
    cols = [c['name'] for c in insp.get_columns('user')]
    with db.engine.connect() as conn:
        if 'fitness' not in cols:
            conn.execute(text('ALTER TABLE user ADD COLUMN fitness TEXT'))
        if 'meditation' not in cols:
            conn.execute(text('ALTER TABLE user ADD COLUMN meditation TEXT'))
        if 'yoga' not in cols:
            conn.execute(text('ALTER TABLE user ADD COLUMN yoga TEXT'))
    print('Migration done')