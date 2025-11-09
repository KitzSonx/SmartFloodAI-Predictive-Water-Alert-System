# ใช้ Python 3.11-slim เป็น Base Image
FROM python:3.11-slim

# ตั้งค่า Environment Variables พื้นฐาน
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8080

# สร้างและตั้งค่า Working Directory
WORKDIR /app

# คัดลอกไฟล์ requirements.txt เข้าไปก่อน
COPY requirements.txt .

# --- นี่คือบรรทัดที่เพิ่มเข้ามา ---
# อัปเกรด PIP ก่อน เพื่อให้แน่ใจว่าใช้ตัวติดตั้งเวอร์ชันล่าสุด
RUN pip install --no-cache-dir --upgrade pip
# --- สิ้นสุดบรรทัดที่เพิ่มเข้ามา ---

# ติดตั้ง Dependencies ทั้งหมด
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโค้ดหลัก (main.py) เข้าไป
COPY main.py .

# คำสั่งที่จะรันเมื่อ Container เริ่มทำงาน
# functions-framework จะค้นหาฟังก์ชันที่ชื่อ water_prediction_main ในไฟล์ main.py
# และรันเป็น Web Server บนพอร์ต $PORT (8080)
CMD ["functions-framework", "--target=water_prediction_main", "--port=8080"]

