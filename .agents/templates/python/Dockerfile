FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir -e .

# Copy implementation
COPY src/ ./src/

CMD ["python", "-m", "src"]
