# Deployment Guide for CTechLit Consultancy

This guide will help you deploy the CTechLit Consultancy application to a production environment.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database
- Git

## Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/CTechLit-Consultancy.git
   cd CTechLit-Consultancy
   ```

2. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. **Set up the database**
   - Create a MySQL database
   - Run the database setup:
     ```bash
     npm run setup-db
     ```

5. **Start the server**
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm install -g pm2
     pm2 start server.js --name "ctechlit-server"
     ```

## Frontend Setup

1. **Install dependencies**
   ```bash
   cd ../client
   npm install
   ```

2. **Configure environment variables**
   - Create a `.env` file in the client directory
   - Set `VITE_API_URL` to your backend API URL

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Serve the production build**
   - The built files will be in the `dist` directory
   - You can serve them using any static file server, for example:
     ```bash
     npm install -g serve
     serve -s dist -l 3000
     ```

## Docker Deployment (Optional)

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

## Environment Variables

Refer to `.env.example` for all required environment variables.

## Deployment to Cloud Platforms

### Heroku

1. Install Heroku CLI and login
2. Create a new Heroku app
3. Set up environment variables
4. Deploy using Git

### Vercel (Frontend)

1. Import your repository
2. Set up environment variables
3. Set build command: `npm run build`
4. Set output directory: `dist`

## Monitoring

- Use PM2 for process management
- Set up logging and monitoring
- Configure alerts for errors

## Maintenance

- Regular database backups
- Keep dependencies updated
- Monitor application performance
