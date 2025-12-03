-- Migration script to add media columns to site_content table
-- Run this script to add the new media-specific columns

USE ctechlit_db;

-- Add media-specific columns to site_content table
ALTER TABLE site_content 
ADD COLUMN media_path VARCHAR(500) NULL AFTER metadata,
ADD COLUMN media_type ENUM('image', 'video', 'audio', 'document', 'other') NULL AFTER media_path,
ADD COLUMN file_size INT NULL AFTER media_type,
ADD COLUMN mime_type VARCHAR(100) NULL AFTER file_size,
ADD COLUMN alt_text VARCHAR(255) NULL AFTER mime_type;

-- Add indexes for better query performance
CREATE INDEX idx_media_type ON site_content(media_type);
CREATE INDEX idx_file_size ON site_content(file_size);

-- Update existing media records (if any) to populate new columns
UPDATE site_content 
SET 
    media_type = CASE 
        WHEN JSON_EXTRACT(metadata, '$.mimetype') LIKE 'image/%' THEN 'image'
        WHEN JSON_EXTRACT(metadata, '$.mimetype') LIKE 'video/%' THEN 'video'
        WHEN JSON_EXTRACT(metadata, '$.mimetype') LIKE 'audio/%' THEN 'audio'
        ELSE 'other'
    END,
    file_size = JSON_EXTRACT(metadata, '$.size'),
    mime_type = JSON_EXTRACT(metadata, '$.mimetype'),
    media_path = JSON_EXTRACT(metadata, '$.filePath')
WHERE JSON_EXTRACT(metadata, '$.filePath') IS NOT NULL;

-- Update content_type for existing media records
UPDATE site_content 
SET content_type = 'media' 
WHERE media_path IS NOT NULL AND content_type != 'media';

-- Verify the changes
SELECT 
    id,
    page,
    section,
    content_type,
    media_path,
    media_type,
    file_size,
    mime_type,
    alt_text,
    created_at
FROM site_content 
WHERE media_path IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;