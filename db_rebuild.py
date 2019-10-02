import openpyxl
import pymongo
import os
import re

# var
TABLE_DIR = 'timetable_xlsx'  # os.path 쓸까
DB_HOST = 'localhost'
DB_PORT = 27017
DB_NAME = 'timetable'
COLLECTION_NAME = 'lectures'

DEBUG = True

# conn
conn = pymongo.MongoClient(DB_HOST, DB_PORT)
conn.drop_database(DB_NAME)  # !

db = conn.get_database(DB_NAME)
print('dbconn succ')
print(db.list_collection_names())

for file in os.listdir(TABLE_DIR):
    if not file.endswith('.xlsx'):
        continue


    ############# DEBUG
    if DEBUG:
        if file != '1.xlsx':
            continue
    ############# DEBUG

    filepath = os.path.join(TABLE_DIR, file)
    print('processing: ' + filepath)
    wb = openpyxl.load_workbook(filepath)
    ws = wb.active

    for r in ws.rows:
        if (r[1].value == '학년') or (r[3].value is None):  # 예외처리 더 강화
            continue

        if (r[9].value is None) or (r[10].value is None) or (r[13].value is None) or (r[13].value == '-'):
            continue

        code, _ = r[3].value.split('-')
        title = r[4].value
        instructor = r[9].value
        hours = r[10].value
        building, classroom = r[13].value.split('-')


        # exception handling
        if building.startswith('상주'):
            continue


        # prepare db collection
        # collection = db.get_collection(building)
        collection = db.get_collection(COLLECTION_NAME)

        # parsing hours
        # 요일 테이블 구성
        day_t = {'일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6}
        # 강의시간 테이블 구성
        hours_t = {'0': 0}
        for i in range(1, 15):
            hours_t[str(i) + 'A'] = 2 * i - 1
            hours_t[str(i) + 'B'] = 2 * i
        curr_day = 0  # 현재 처리중인 요일

        # hour를 starts, ends로 바꾸자
        hour = 0
        for tok in re.split(',| ', hours):
            if tok[0] in day_t.keys():
                # change day
                curr_day = day_t[tok[0]]
                hour = hours_t[tok[1:]]
            else:
                hour = hours_t[tok]
            # db insertion
            obj = {'code': code, 'title': title, 'instructor': instructor,
                   'day': curr_day, 'hour': hour, 'building': building, 'classroom': classroom}
            print(obj)
            collection.insert(obj)


conn.close()
