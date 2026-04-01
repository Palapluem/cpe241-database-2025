import sys
try:
    import PyPDF2
    reader = PyPDF2.PdfReader('d:\\cpe241-database-2025\\labs\\PS06_Feedback on ERD with Normalization Exercises\\Lab06_CPE241.pdf')
    for p in reader.pages:
        print(p.extract_text())
except Exception as e:
    try:
        import fitz
        doc = fitz.open('d:\\cpe241-database-2025\\labs\\PS06_Feedback on ERD with Normalization Exercises\\Lab06_CPE241.pdf')
        for p in doc:
            print(p.get_text())
    except Exception as e2:
        print('Error PyPDF2:', e)
        print('Error fitz:', e2)
