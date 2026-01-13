FROM python:3.11-slim

# Prevent Python from buffering stdout/stderr (better logs in Railway)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first to leverage Docker caching
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app code
COPY . .

# Use the PORT environment variable provided by Railway
# Default to 8000 if not set locally
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}