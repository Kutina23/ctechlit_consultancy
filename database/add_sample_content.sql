-- Add sample content to site_content table for homepage
USE ctechlit_db;

-- Clear existing content to avoid conflicts
DELETE FROM site_content WHERE page = 'home';

-- Insert hero section content
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
    'json',
    '{"title": "IT SOLUTIONS", "subtitle": "CONSULTANCY", "description": "Leading experts in cybersecurity consulting, robotics & AI development, programming education, and IT infrastructure solutions for businesses and educational institutions.", "cta_text": "GET IT CONSULTATION"}',
    '{"featured": true, "background_image": "/images/hero-bg.jpg", "animation": "fade-in-up"}',
    true
),
(
    'home',
    'about',
    'json',
    '{"title": "About CTechLit", "description": "CTechLit is a leading technology consultancy firm dedicated to helping businesses harness the power of technology to achieve their goals. With over a decade of experience, we provide comprehensive solutions tailored to your unique needs.", "features": ["Cybersecurity Consulting", "Robotics & AI Development", "Programming Education", "IT Infrastructure Solutions"]}',
    '{"image": "/images/about.jpg", "stats": [{"number": "500+", "label": "Projects Completed"}, {"number": "50+", "label": "Enterprise Clients"}, {"number": "95%", "label": "Success Rate"}, {"number": "24/7", "label": "Technical Support"}]}',
    true
),
(
    'home',
    'stats',
    'json',
    '{"stats": [{"number": "500+", "label": "Projects Completed"}, {"number": "50+", "label": "Enterprise Clients"}, {"number": "95%", "label": "Success Rate"}, {"number": "24/7", "label": "Technical Support"}]}',
    '{"layout": "grid", "columns": 4}',
    true
),
(
    'home',
    'services_intro',
    'json',
    '{"title": "SPECIALIZED", "subtitle": "SOLUTIONS", "description": "Comprehensive IT consultancy services tailored for modern businesses and educational institutions"}',
    '{"layout": "centered", "featured": true}',
    true
);