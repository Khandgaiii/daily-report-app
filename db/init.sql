DROP TABLE IF EXISTS report CASCADE;

CREATE TABLE report (

    id SERIAL PRIMARY KEY,

    user_name VARCHAR(50) NOT NULL,

    report_date DATE NOT NULL,

    title VARCHAR(100) NOT NULL,

    content TEXT NOT NULL,

    hours NUMERIC(4,1) NOT NULL,

    status VARCHAR(10) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    CONSTRAINT chk_user_name
        CHECK (
            LENGTH(TRIM(user_name))
            BETWEEN 1 AND 50
        ),

    CONSTRAINT chk_title
        CHECK (
            LENGTH(TRIM(title))
            BETWEEN 1 AND 100
        ),

    CONSTRAINT chk_content
        CHECK (
            LENGTH(TRIM(content))
            BETWEEN 1 AND 1000
        ),

    CONSTRAINT chk_hours
        CHECK (
            hours >= 0.5
            AND
            hours <= 24.0
        ),

    CONSTRAINT chk_status
        CHECK (

            status IN
            (
                '未着手',
                '進行中',
                '完了'
            )

        )

);

CREATE INDEX idx_report_date
ON report(report_date);

CREATE INDEX idx_user_name
ON report(user_name);

CREATE INDEX idx_title
ON report(title);

CREATE OR REPLACE FUNCTION update_updated_at_column()

RETURNS TRIGGER AS $$

BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_report

BEFORE UPDATE

ON report

FOR EACH ROW

EXECUTE FUNCTION
update_updated_at_column();