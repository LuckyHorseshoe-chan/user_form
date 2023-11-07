from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
import pandas as pd
import re
import os
import aspose.pdf as ap

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/data")
async def data(form: dict):
    message = 'ок'
    df, extra = {}, {}
    user_id = -1
    errors = []
    try:
        document = ap.Document()
        page = document.pages.add()
        table = pd.read_csv('table.csv', sep=';')
        for item in form["data"]:
            if item["name"] in list(table.columns):
                df[item["name"]] = item["value"]
            else:
                extra[item["name"]] = item["value"]
            success, error = validate(item)
            if not len(errors):
                text_fragment = ap.text.TextFragment(f"{item['name']}: {item['value']}")
                page.paragraphs.add(text_fragment)
            if not success:
                errors.append(error)
        df['id'] = str(uuid.uuid4())[:8]
        user_id = df['id']
        if not len(errors):
            document.save(f"reports/{df['id']}.pdf")
        table.loc[len(table)] = df
        table.to_csv('table.csv', sep=';', index=False)
    except:
        message = 'Ошибка. Некорректные данные'
    if (len(errors)):
        message = 'Ошибка: ' + ', '.join(errors) 
    return { 'id': user_id, 'message': message }

@app.post("/files")
async def files(files: List[UploadFile] = File(...)):
    msg = 'ок'
    try:
        table = pd.read_csv('table.csv', sep=';')
        file_location = f"files/{table.iloc[-1]['id']}"
        os.mkdir(file_location)
        for uploaded_file in files:
            with open(f'{file_location}/{uploaded_file.filename}', "wb+") as file_object:
                file_object.write(uploaded_file.file.read())
    except:
        msg = "не удалось отправить файлы"
    return {"message": msg}


def validate(item):
    if item["name"] == "firstName":
        pattern = re.compile('[А-Яа-я]{2,25}')
        if not bool(pattern.fullmatch(item["value"])):
            return False, "некорректное имя"
    if item["name"] == "lastName":
        pattern = re.compile('[А-Яа-я]{2,25}')
        if not bool(pattern.fullmatch(item["value"])):
            return False, "некорректная фамилия"
    if item["name"] == "patronymic":
        pattern = re.compile('[А-Яа-я]{2,25}')
        if not (bool(pattern.fullmatch(item["value"])) or item["value"] == ''):
            return False, "некорректное отчество"
    if item["name"] == "email":
        pattern = re.compile('([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
        if not bool(pattern.fullmatch(item["value"])):
            return False, "некорректная почта"
    if item["name"] == "phone":
        pattern = re.compile('^\\+?7[0-9]{10}$')
        if not bool(pattern.fullmatch(item["value"])):
            return False, "некорректный телефон"
    if item["name"] == "address":
        if item["value"] == "":
            return False, "адрес не задан"
    return True, ""