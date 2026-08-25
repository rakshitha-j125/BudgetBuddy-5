from sqlalchemy import inspect, text

from app.database import engine
from app.models.bank_account import BankAccount


def column_exists(inspector, table_name, column_name):
    return any(
        column["name"] == column_name
        for column in inspector.get_columns(table_name)
    )


def main():
    inspector = inspect(engine)

    BankAccount.__table__.create(
        bind=engine,
        checkfirst=True
    )

    inspector = inspect(engine)

    with engine.begin() as connection:

        if not column_exists(
            inspector,
            "expenses",
            "bank_account_id"
        ):
            connection.execute(
                text("""
                    ALTER TABLE expenses
                    ADD COLUMN bank_account_id INTEGER
                """)
            )

        if not column_exists(
            inspector,
            "incomes",
            "bank_account_id"
        ):
            connection.execute(
                text("""
                    ALTER TABLE incomes
                    ADD COLUMN bank_account_id INTEGER
                """)
            )

        connection.execute(
            text("""
                UPDATE expenses e
                SET bank_account_id = ba.id
                FROM bank_accounts ba
                WHERE e.bank_account_id IS NULL
                  AND e.user_id = ba.user_id
                  AND ba.is_active = TRUE
            """)
        )

        connection.execute(
            text("""
                UPDATE incomes i
                SET bank_account_id = ba.id
                FROM bank_accounts ba
                WHERE i.bank_account_id IS NULL
                  AND i.user_id = ba.user_id
                  AND ba.is_active = TRUE
            """)
        )

        connection.execute(
            text("""
                CREATE INDEX IF NOT EXISTS
                ix_expenses_bank_account_id
                ON expenses(bank_account_id)
            """)
        )

        connection.execute(
            text("""
                CREATE INDEX IF NOT EXISTS
                ix_incomes_bank_account_id
                ON incomes(bank_account_id)
            """)
        )

    print("Bank account migration and backfill completed successfully.")


if __name__ == "__main__":
    main()