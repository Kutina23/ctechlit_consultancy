#!/usr/bin/env node

/**
 * CTechLit Database Setup Script
 * 
 * This script helps initialize the CTechLit database with the required schema and sample data.
 * 
 * Prerequisites:
 * - MySQL server running on localhost:3306
 * - MySQL user with CREATE, INSERT, SELECT, UPDATE, DELETE privileges
 * - Database 'ctechlit_db' will be created if it doesn't exist
 * 
 * Usage:
 *   node setup-database.js [options]
 * 
 * Options:
 *   --skip-sample-data    Skip inserting sample data
 *   --drop-existing       Drop and recreate the database
 *   --help               Show this help message
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class DatabaseSetup {
    constructor() {
        this.config = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'ctechlit_db'
        };
        
        this.options = {
            skipSampleData: false,
            dropExisting: false
        };
    }

    async createConnection(database = null) {
        const config = { ...this.config };
        if (database) config.database = database;
        
        return await mysql.createConnection(config);
    }

    async parseArguments() {
        const args = process.argv.slice(2);
        
        for (const arg of args) {
            switch (arg) {
                case '--skip-sample-data':
                    this.options.skipSampleData = true;
                    break;
                case '--drop-existing':
                    this.options.dropExisting = true;
                    break;
                case '--help':
                    this.showHelp();
                    process.exit(0);
                    break;
            }
        }
    }

    showHelp() {
        console.log(`
CTechLit Database Setup Script

This script helps initialize the CTechLit database with the required schema and sample data.

Prerequisites:
- MySQL server running on localhost:3306
- MySQL user with CREATE, INSERT, SELECT, UPDATE, DELETE privileges
- Database 'ctechlit_db' will be created if it doesn't exist

Usage:
  node setup-database.js [options]

Options:
  --skip-sample-data    Skip inserting sample data
  --drop-existing       Drop and recreate the database
  --help               Show this help message

Environment Variables (optional):
  DB_HOST=localhost       MySQL host
  DB_PORT=3306           MySQL port
  DB_USER=root           MySQL username
  DB_PASSWORD=           MySQL password
`);
    }

    async testConnection() {
        try {
            console.log('🔗 Testing database connection...');
            const connection = await this.createConnection();
            await connection.ping();
            await connection.end();
            console.log('✅ Database connection successful!');
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            console.log('\nPlease check:');
            console.log('1. MySQL server is running');
            console.log('2. Database credentials in server/.env');
            console.log('3. MySQL user has proper privileges');
            return false;
        }
    }

    async createDatabase() {
        try {
            console.log('🗃️  Creating database...');
            const connection = await this.createConnection(); // Connect without specific database
            
            if (this.options.dropExisting) {
                console.log('🗑️  Dropping existing database...');
                await connection.execute(`DROP DATABASE IF EXISTS ${this.config.database}`);
            }
            
            await connection.execute(`CREATE DATABASE IF NOT EXISTS ${this.config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
            await connection.end();
            console.log('✅ Database created successfully!');
        } catch (error) {
            console.error('❌ Failed to create database:', error.message);
            throw error;
        }
    }

    async runSQLFile(filePath, description) {
        try {
            console.log(`📄 ${description}...`);
            
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }
            
            const sql = fs.readFileSync(filePath, 'utf8');
            const connection = await this.createConnection();
            
            // Split SQL into individual statements
            const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
            
            for (const statement of statements) {
                const trimmed = statement.trim();
                if (trimmed.length > 0) {
                    await connection.execute(trimmed + ';');
                }
            }
            
            await connection.end();
            console.log(`✅ ${description} completed successfully!`);
        } catch (error) {
            console.error(`❌ Failed to ${description.toLowerCase()}:`, error.message);
            throw error;
        }
    }

    async setup() {
        try {
            console.log('🚀 CTechLit Database Setup Started\n');
            
            // Test connection
            if (!(await this.testConnection())) {
                process.exit(1);
            }
            
            // Create database
            await this.createDatabase();
            
            // Run schema
            await this.runSQLFile(
                path.join(__dirname, 'schema.sql'),
                'Creating database schema'
            );
            
            // Run sample data if not skipped
            if (!this.options.skipSampleData) {
                await this.runSQLFile(
                    path.join(__dirname, 'sample_data.sql'),
                    'Inserting sample data'
                );
            }
            
            console.log('\n🎉 Database setup completed successfully!');
            console.log('\nNext steps:');
            console.log('1. Start the server: cd server && npm start');
            console.log('2. Start the client: cd client && npm start');
            console.log('3. Login with admin credentials:');
            console.log('   Email: admin@ctechlit.com');
            console.log('   Password: admin123');
            
        } catch (error) {
            console.error('\n❌ Database setup failed:', error.message);
            console.log('\nTroubleshooting:');
            console.log('1. Check MySQL server is running');
            console.log('2. Verify credentials in server/.env');
            console.log('3. Ensure MySQL user has CREATE privileges');
            console.log('4. Try running with --drop-existing to recreate database');
            process.exit(1);
        }
    }
}

// Create and run setup
const setup = new DatabaseSetup();
setup.parseArguments().then(() => setup.setup());