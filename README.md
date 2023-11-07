Запустить backend:  
```
cd backend
pip install requirements.txt
uvicorn main:app --reload
```
  
Запустить файловый сервер:  
```
cd backend
mkdir reports
cd reports
python -m http.server 8080
```
  
Запустить frontend:  
```
npm install
npm start
```