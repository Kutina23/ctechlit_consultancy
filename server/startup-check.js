#!/usr/bin/env node

/**
 * CTechLit Server Startup Check Script
 * 
 * This script checks if the server can start properly and validates the environment.
 * Run this before starting the server to identify potential issues.
 * 
 * Usage:
 *   node startup-check.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class StartupCheck {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.checks = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    addIssue(message) {
        this.issues.push(message);
        this.log(message, 'error');
    }

    addWarning(message) {
        this.warnings.push(message);
        this.log(message, 'warning');
    }

    addSuccess(message) {
        this.checks.push(message);
        this.log(message);
    }

    async checkNodeVersion() {
        try {
            const { stdout } = await execAsync('node --version');
            const version = stdout.trim();
            const majorVersion = parseInt(version.slice(1).split('.')[0]);
            
            if (majorVersion >= 14) {
                this.addSuccess(`Node.js version: ${version} (compatible)`);
            } else {
                this.addIssue(`Node.js version ${version} is too old. Please upgrade to Node.js 14 or higher.`);
            }
        } catch (error) {
            this.addIssue('Node.js is not installed or not in PATH');
        }
    }

    async checkNpmVersion() {
        try {
            const { stdout } = await execAsync('npm --version');
            const version = stdout.trim();
            this.addSuccess(`npm version: ${version}`);
        } catch (error) {
            this.addIssue('npm is not installed or not in PATH');
        }
    }

    checkEnvFile() {
        const envPath = path.join(__dirname, '.env');
        
        if (fs.existsSync(envPath)) {
            this.addSuccess('.env file exists');
            
            // Check required environment variables
            const requiredVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
            const envContent = fs.readFileSync(envPath, 'utf8');
            
            for (const variable of requiredVars) {
                if (envContent.includes(`${variable}=`)) {
                    this.addSuccess(`Environment variable ${variable} is set`);
                } else {
                    this.addIssue(`Environment variable ${variable} is missing`);
                }
            }
            
            // Check for empty passwords (common development issue)
            if (envContent.includes('DB_PASSWORD=') && !envContent.match(/DB_PASSWORD=[^#\s]+/)) {
                this.addWarning('DB_PASSWORD is empty. Make sure your MySQL user has no password or update the .env file.');
            }
        } else {
            this.addIssue('.env file not found. Please copy .env.example to .env and configure it.');
        }
    }

    checkPackageJson() {
        const packagePath = path.join(__dirname, 'package.json');
        
        if (fs.existsSync(packagePath)) {
            this.addSuccess('package.json exists');
            
            try {
                const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                
                if (packageData.dependencies && Object.keys(packageData.dependencies).length > 0) {
                    this.addSuccess('Dependencies are defined');
                } else {
                    this.addWarning('No dependencies found. Run "npm install" first.');
                }
                
                if (packageData.scripts && packageData.scripts.start) {
                    this.addSuccess('Start script is defined');
                } else {
                    this.addIssue('Start script is missing in package.json');
                }
            } catch (error) {
                this.addIssue('package.json is not valid JSON');
            }
        } else {
            this.addIssue('package.json not found');
        }
    }

    async checkNodeModules() {
        const nodeModulesPath = path.join(__dirname, 'node_modules');
        
        if (fs.existsSync(nodeModulesPath)) {
            this.addSuccess('node_modules directory exists');
            
            // Check if it's not empty
            const files = fs.readdirSync(nodeModulesPath);
            if (files.length > 0) {
                this.addSuccess('node_modules appears to be populated');
            } else {
                this.addWarning('node_modules is empty. Run "npm install" to install dependencies.');
            }
        } else {
            this.addIssue('node_modules directory not found. Run "npm install" first.');
        }
    }

    async checkDatabaseConnection() {
        try {
            // Try to load environment variables
            require('dotenv').config();
            
            const mysql = require('mysql2/promise');
            
            const config = {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'ctechlit_db'
            };
            
            const connection = await mysql.createConnection(config);
            await connection.ping();
            await connection.end();
            
            this.addSuccess(`Database connection successful to ${config.host}:${config.port}/${config.database}`);
        } catch (error) {
            this.addIssue(`Database connection failed: ${error.message}`);
            this.addIssue('Please ensure:');
            this.addIssue('1. MySQL server is running');
            this.addIssue('2. Database credentials are correct in .env');
            this.addIssue('3. Database exists (run "node ../database/setup-database.js")');
        }
    }

    checkPortAvailability(port = 5000) {
        const net = require('net');
        
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.listen(port, () => {
                server.once('close', () => {
                    this.addSuccess(`Port ${port} is available`);
                    resolve(true);
                });
                server.close();
            });
            
            server.on('error', () => {
                this.addWarning(`Port ${port} is already in use. Server may already be running.`);
                resolve(false);
            });
        });
    }

    checkFilePermissions() {
        const uploadsPath = path.join(__dirname, 'uploads');
        
        try {
            if (!fs.existsSync(uploadsPath)) {
                fs.mkdirSync(uploadsPath, { recursive: true });
                this.addSuccess('Created uploads directory');
            }
            
            // Test write permissions
            const testFile = path.join(uploadsPath, 'test.txt');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            this.addSuccess('Write permissions are working');
        } catch (error) {
            this.addIssue(`File permission issues: ${error.message}`);
            this.addIssue('Try running with appropriate permissions or as administrator');
        }
    }

    async runAllChecks() {
        console.log('🔍 CTechLit Server Startup Check\n');
        console.log('Checking system requirements and configuration...\n');

        // Basic checks
        await this.checkNodeVersion();
        await this.checkNpmVersion();
        
        // Configuration checks
        this.checkEnvFile();
        this.checkPackageJson();
        
        // Dependencies
        await this.checkNodeModules();
        
        // Database
        await this.checkDatabaseConnection();
        
        // System resources
        await this.checkPortAvailability();
        this.checkFilePermissions();

        // Summary
        console.log('\n📋 Startup Check Summary\n');
        
        if (this.issues.length === 0 && this.warnings.length === 0) {
            this.addSuccess('🎉 All checks passed! Server should start successfully.');
            console.log('\n🚀 You can now start the server with: npm start');
            return true;
        } else {
            if (this.issues.length > 0) {
                console.log(`❌ ${this.issues.length} critical issue(s) found:`);
                this.issues.forEach(issue => console.log(`   • ${issue}`));
            }
            
            if (this.warnings.length > 0) {
                console.log(`\n⚠️  ${this.warnings.length} warning(s) found:`);
                this.warnings.forEach(warning => console.log(`   • ${warning}`));
            }
            
            console.log('\n🛠️  Fix the issues above before starting the server.');
            console.log('   For detailed troubleshooting, see TROUBLESHOOTING.md');
            return false;
        }
    }
}

// Run the check
const checker = new StartupCheck();
checker.runAllChecks().then(success => {
    process.exit(success ? 0 : 1);
});