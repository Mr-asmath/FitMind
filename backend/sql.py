import sqlite3

def main() -> None:
    # Open (or create) the database file
    conn = sqlite3.connect("users.db")
    cur = conn.cursor()

    while True:
        sql_query = input("sql>>> ").strip()

        # Exit commands
        if sql_query.lower() in {"0", "exit", "quit"}:
            break

        try:
            cur.execute(sql_query)

            # Handle SELECT or PRAGMA queries
            if sql_query.lstrip().lower().startswith(("select", "pragma")):
                # Print column names (attributes)
                column_names = [description[0] for description in cur.description]
                print(" | ".join(column_names))
                print("-" * (len(" | ".join(column_names))))

                # Print row data
                rows = cur.fetchall()
                for row in rows:
                    print(" | ".join(str(val) for val in row))

            else:
                conn.commit()
                print(f"{cur.rowcount} row(s) affected.")

        except sqlite3.Error as err:
            print(f"SQLite error: {err}")

    conn.close()

if __name__ == "__main__":
    main()
