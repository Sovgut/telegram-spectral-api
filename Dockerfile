FROM node:20

# Set the working directory
WORKDIR /usr/app

# Copy the entire project
COPY ./ ./

# Install os dependencies
RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get install -y libvips 

# Install node modules
RUN npm install --emit=dev
RUN npm rebuild --verbose sharp

# Build the app
RUN npm run build

EXPOSE 80

# Reexport the environment variables
# App
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV WEBSITES_PORT=80
ENV APP_SECRET=$APP_SECRET
ENV LOG_LEVEL=$LOG_LEVEL

# Telegram
ENV TELEGRAM_API_ID=$TELEGRAM_API_ID
ENV TELEGRAM_API_HASH=$TELEGRAM_API_HASH
ENV TELEGRAM_PHONE_NUMBER=$TELEGRAM_PHONE_NUMBER
ENV TELEGRAM_PASSWORD=$TELEGRAM_PASSWORD
ENV TELEGRAM_SESSION_STRING=$TELEGRAM_SESSION_STRING

# Azure
ENV AZURE_STORAGE_CONNECTIONSTRING=$AZURE_STORAGE_CONNECTIONSTRING
ENV AZURE_STORAGE_CONTAINER_NAME=$AZURE_STORAGE_CONTAINER_NAME
ENV AZURE_STORAGE_ACCOUNT_NAME=$AZURE_STORAGE_ACCOUNT_NAME
ENV AZURE_COSMOS_CONNECTIONSTRING=$AZURE_COSMOS_CONNECTIONSTRING

# Run the app
CMD ["npm", "start"]
