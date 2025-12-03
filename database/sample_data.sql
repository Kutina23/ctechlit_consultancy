-- CTechLit Sample Data Insertion Script
-- Run this after creating the schema

USE ctechlit_db;

-- Insert default admin user (password: admin123)
INSERT INTO users (
    email, 
    password, 
    first_name, 
    last_name, 
    role, 
    status
) VALUES (
    'admin@ctechlit.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj86w0fB5F9K', -- hashed 'admin123'
    'Admin',
    'User',
    'admin',
    'active'
);

-- Insert sample services
INSERT INTO services (
    name, 
    description, 
    price, 
    duration, 
    category, 
    features, 
    requirements,
    status
) VALUES 
(
    'Web Development',
    'Custom web application development using modern technologies. We build responsive, scalable, and secure web applications tailored to your business needs.',
    5000.00,
    '4-8 weeks',
    'Development',
    '["Responsive Design", "Modern Framework", "Database Integration", "API Development", "Testing & Deployment", "3 Months Support"]',
    '["Business requirements document", "Content and branding materials", "Target audience analysis"]',
    'active'
),
(
    'Mobile App Development',
    'Native and cross-platform mobile application development for iOS and Android. We create user-friendly mobile apps that drive engagement and business growth.',
    8000.00,
    '6-12 weeks',
    'Development',
    '["iOS & Android Support", "Cross-platform Development", "UI/UX Design", "Backend Integration", "App Store Deployment", "6 Months Support"]',
    '["App concept and features", "Target platform specification", "Design preferences"]',
    'active'
),
(
    'Cloud Migration',
    'Comprehensive cloud migration services to help your business leverage the power of cloud computing for improved scalability and cost efficiency.',
    12000.00,
    '8-12 weeks',
    'Infrastructure',
    '["Assessment & Planning", "Data Migration", "Security Setup", "Performance Optimization", "Training & Documentation", "12 Months Support"]',
    '["Current infrastructure assessment", "Security requirements", "Compliance needs"]',
    'active'
),
(
    'Digital Transformation',
    'End-to-end digital transformation consulting to modernize your business processes and improve operational efficiency through technology.',
    15000.00,
    '12-16 weeks',
    'Consulting',
    '["Process Analysis", "Technology Roadmap", "Change Management", "Staff Training", "Implementation Support", "24 Months Support"]',
    '["Current business processes", "Organizational structure", "Strategic goals"]',
    'active'
),
(
    'Cybersecurity Audit',
    'Comprehensive security assessment and penetration testing to identify vulnerabilities and protect your digital assets from cyber threats.',
    6000.00,
    '3-4 weeks',
    'Security',
    '["Vulnerability Assessment", "Penetration Testing", "Security Report", "Remediation Plan", "Compliance Check", "6 Months Monitoring"]',
    '["Network topology", "Current security measures", "Compliance requirements"]',
    'active'
),
(
    'Data Analytics Solution',
    'Advanced data analytics and business intelligence solutions to help you make data-driven decisions and gain competitive insights.',
    10000.00,
    '6-10 weeks',
    'Analytics',
    '["Data Pipeline Setup", "Dashboard Creation", "Custom Reports", "Predictive Analytics", "Training", "12 Months Support"]',
    '["Data sources identification", "Business KPIs", "Reporting requirements"]',
    'active'
),
(
    'E-commerce Platform',
    'Custom e-commerce solution development with payment integration, inventory management, and customer management features.',
    7000.00,
    '6-10 weeks',
    'Development',
    '["Shopping Cart", "Payment Gateway", "Inventory Management", "Order Processing", "Customer Portal", "6 Months Support"]',
    '["Product catalog", "Payment methods", "Shipping requirements"]',
    'active'
),
(
    'AI/ML Implementation',
    'Artificial Intelligence and Machine Learning solutions to automate processes and gain predictive insights for your business.',
    20000.00,
    '12-20 weeks',
    'AI/ML',
    '["AI Strategy", "Model Development", "Data Preparation", "Integration", "Training", "24 Months Support"]',
    '["Business problem definition", "Historical data availability", "Success metrics"]',
    'active'
);

-- Insert sample site content
INSERT INTO site_content (
    page,
    section,
    content_type,
    content,
    metadata,
    is_active
) VALUES 
(
    'home',
    'hero',
    'html',
    '<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Transform Your Business with Technology</h1><p class="text-xl text-gray-600 mb-8 max-w-2xl">We provide cutting-edge technology consulting services to help businesses innovate, scale, and thrive in the digital age.</p>',
    '{"title": "Welcome to CTechLit", "cta_text": "Get Started Today"}',
    true
),
(
    'home',
    'about',
    'text',
    'CTechLit is a leading technology consultancy firm dedicated to helping businesses harness the power of technology to achieve their goals. With over a decade of experience, we provide comprehensive solutions tailored to your unique needs.',
    '{"image": "/images/about.jpg", "stats": [{"number": "500+", "label": "Projects Completed"}, {"number": "200+", "label": "Happy Clients"}, {"number": "10+", "label": "Years Experience"}]}',
    true
),
(
    'services',
    'intro',
    'html',
    '<div class="text-center mb-12"><h2 class="text-3xl font-bold text-gray-900 mb-4">Our Services</h2><p class="text-lg text-gray-600 max-w-2xl mx-auto">We offer a comprehensive range of technology services designed to accelerate your business growth and digital transformation.</p></div>',
    '{"layout": "centered"}',
    true
),
(
    'contact',
    'info',
    'json',
    '{"address": "123 Tech Street, Innovation City, IC 12345", "phone": "+1 (555) 123-4567", "email": "info@ctechlit.com", "hours": "Monday - Friday: 9:00 AM - 6:00 PM PST"}',
    '{"social": {"linkedin": "https://linkedin.com/company/ctechlit", "twitter": "https://twitter.com/ctechlit"}}',
    true
);

-- Insert sample notifications for admin user
INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    is_read
) VALUES 
(
    1,
    'Welcome to CTechLit Admin Panel',
    'Your admin account has been successfully created. You can now manage users, service requests, and site content.',
    'success',
    false
),
(
    1,
    'System Ready',
    'The CTechLit system has been set up and is ready for use. You can start managing your consultancy business.',
    'info',
    false
);

-- Insert sample file upload record
INSERT INTO file_uploads (
    user_id,
    original_name,
    file_name,
    file_path,
    file_size,
    mime_type,
    file_type,
    entity_type,
    entity_id
) VALUES 
(
    1,
    'logo.png',
    'logo_1640995200.png',
    '/uploads/logo_1640995200.png',
    25480,
    'image/png',
    'image',
    'site_content',
    1
);