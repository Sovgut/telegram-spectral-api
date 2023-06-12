FROM node:20.3-bullseye-slim

# Set the working directory
WORKDIR /usr/app

# Install os dependencies
RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get install -y libvips 

# Copy the entire project except the files in .dockerignore
COPY . .

# Install production dependencies
RUN npm ci --emit=dev
RUN npm rebuild --verbose sharp

# Build the app
RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080

# Run the app
CMD ["npm", "start"]
