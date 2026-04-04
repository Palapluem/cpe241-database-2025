
import os

path = r'd:\cpe241-database-2025\homework\Individual01_Webapp installation\InvoiceDoc2-main\database\sql\003_seed.sql'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip().startswith('>'):
        continue # Skip corrupted lines
    if "pg_get_serial_sequence('sales_person'" in line:
        continue # Skip corrupted setval
    new_lines.append(line)

# Append correct seed data
content_to_append = """

-- Populating table: sales_person
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (1, now(), 'SP001', 'Anan Srisuk', '2022-01-10') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (2, now(), 'SP002', 'Benjamas Wongsa', '2021-06-01') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (3, now(), 'SP003', 'Chaiwat Kitti', '2020-11-15') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (4, now(), 'SP004', 'Duangkamol Sae-Lim', '2019-03-04') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (5, now(), 'SP005', 'Ekkarat Manee', '2023-02-20') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (6, now(), 'SP006', 'Fahsai Inta', '2022-08-08') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (7, now(), 'SP007', 'Gamonrat Tansri', '2020-12-01') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (8, now(), 'SP008', 'Hataichanok Preecha', '2024-01-05') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (9, now(), 'SP009', 'Ittipon Yim', '2021-09-12') ON CONFLICT DO NOTHING;
INSERT INTO sales_person (id, created_at, code, name, start_work_date) VALUES (10, now(), 'SP010', 'Jirapat Boonmee', '2023-07-17') ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('sales_person', 'id'), coalesce(max(id),0) + 1, false) FROM sales_person;
"""

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    f.write(content_to_append)

print("Fixed 003_seed.sql")
