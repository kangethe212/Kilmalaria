FROM rasa/rasa:3.6.13

WORKDIR /app

# Copy Rasa files
COPY . /app

# Train the model
USER root
RUN rasa train --fixed-model-name malaria-bot

USER 1001

# Expose Rasa port
EXPOSE 5005

