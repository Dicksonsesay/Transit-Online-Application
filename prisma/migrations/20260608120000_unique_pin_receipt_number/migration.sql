-- Backfill missing receipt numbers before enforcing uniqueness.
UPDATE "pins"
SET "receipt_number" = 'RCP-' || EXTRACT(YEAR FROM "created_at")::text || '-' || LPAD("id"::text, 5, '0')
WHERE "receipt_number" IS NULL OR BTRIM("receipt_number") = '';

-- Normalize stored receipt numbers.
UPDATE "pins"
SET "receipt_number" = UPPER(BTRIM("receipt_number"))
WHERE "receipt_number" IS NOT NULL;

-- Resolve any historical duplicates by suffixing the pin id.
WITH ranked AS (
  SELECT
    "id",
    "receipt_number",
    ROW_NUMBER() OVER (
      PARTITION BY UPPER(BTRIM("receipt_number"))
      ORDER BY "id"
    ) AS row_num
  FROM "pins"
  WHERE "receipt_number" IS NOT NULL AND BTRIM("receipt_number") <> ''
)
UPDATE "pins" AS p
SET "receipt_number" = LEFT(p."receipt_number", 92) || '-' || p."id"::text
FROM ranked AS r
WHERE p."id" = r."id"
  AND r.row_num > 1;

-- CreateIndex
CREATE UNIQUE INDEX "pins_receipt_number_key" ON "pins"("receipt_number");
