const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// @route   GET /api/public/content
// @desc    Get public site content
// @access  Public
router.get('/content', async (req, res) => {
  try {
    // Get active site content with media columns
    const content = await executeQuery(
      `SELECT id, page, section, content_type, content, metadata, 
              media_path, media_type, file_size, mime_type, alt_text,
              created_at, updated_at 
       FROM site_content 
       WHERE is_active = TRUE 
       ORDER BY page, section`
    );

    // Transform to match frontend structure
    const transformedContent = {
      pages: {},
      blogPosts: [],
      media: [],
      settings: {
        seo: {
          siteTitle: "CTechLit Consultancy",
          siteDescription: "Professional technology consultancy services for modern businesses",
          keywords: "technology consulting, web development, digital transformation, software solutions",
          googleAnalytics: "GA-XXXXXXXXX",
          googleTagManager: "GTM-XXXXXXX"
        },
        social: {
          facebook: "https://facebook.com/ctechlit",
          twitter: "https://twitter.com/ctechlit",
          linkedin: "https://linkedin.com/company/ctechlit",
          instagram: "https://instagram.com/ctechlit"
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          newUserAlerts: true,
          systemAlerts: true
        }
      }
    };

    // Transform database content to frontend format
    content.forEach(item => {
      try {
        // Safely parse content and metadata with fallbacks
        let contentData = {};
        let metadata = {};
        
        try {
          contentData = item.content ? JSON.parse(item.content) : {};
        } catch (e) {
          // If JSON parsing fails, treat content as plain text
          contentData = { title: item.content || item.page, description: item.content || '' };
        }
        
        try {
          metadata = item.metadata ? JSON.parse(item.metadata) : {};
        } catch (e) {
          metadata = {};
        }

        // Create page structure if it doesn't exist
        if (!transformedContent.pages[item.page]) {
          transformedContent.pages[item.page] = {
            title: contentData.title || item.page.charAt(0).toUpperCase() + item.page.slice(1),
            sections: {}
          };
        }

        // Add section to page
        transformedContent.pages[item.page].sections[item.section] = {
          id: item.id,
          type: item.content_type,
          content: contentData,
          metadata: metadata,
          rawContent: item.content,
          lastModified: item.updated_at
        };

        // Extract media content for homepage media section
        if (item.media_path || contentData.path) {
          // Use the new media columns or fallback to JSON content
          const mediaPath = item.media_path || contentData.path;
          const mimetype = item.mime_type || contentData.mimetype;
          const filename = contentData.filename || contentData.originalName || 
                          (mediaPath ? mediaPath.split('/').pop() : 'Unknown file');
          const altText = item.alt_text || metadata.alt || contentData.description || '';
          
          // Build proper URL for the frontend
          let mediaUrl = '';
          if (mediaPath) {
            if (mediaPath.startsWith('http')) {
              mediaUrl = mediaPath;
            } else {
              mediaUrl = `http://localhost:5000${mediaPath}`;
            }
          }
          
          transformedContent.media.push({
            id: item.id,
            title: contentData.title || contentData.originalName || item.section || filename,
            description: altText,
            path: mediaPath || '',
            url: mediaUrl,
            mimetype: mimetype || 'unknown',
            size: item.file_size || contentData.size,
            filename: filename,
            originalName: contentData.originalName || filename,
            alt: altText,
            uploadedAt: metadata.uploadedAt || item.created_at,
            ...metadata
          });
        }

      } catch (error) {
        console.error('Error processing content item:', error, item);
        // Continue with next item instead of failing the entire request
      }
    });

    res.json({
      status: 'Success',
      data: {
        content: transformedContent
      }
    });

  } catch (error) {
    console.error('Get public content error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch site content'
    });
  }
});

// @route   GET /api/public/content/:page
// @desc    Get content for specific page
// @access  Public
router.get('/content/:page', async (req, res) => {
  try {
    const { page } = req.params;

    // Get active content for specific page
    const content = await executeQuery(
      `SELECT id, section, content_type, content, metadata, created_at, updated_at 
       FROM site_content 
       WHERE page = ? AND is_active = TRUE 
       ORDER BY section`,
      [page]
    );

    const pageContent = {
      page: page,
      title: page.charAt(0).toUpperCase() + page.slice(1),
      sections: {}
    };

    // Transform content
    content.forEach(item => {
      try {
        let contentData = {};
        let metadata = {};
        
        try {
          contentData = item.content ? JSON.parse(item.content) : {};
        } catch (e) {
          contentData = { title: item.content || item.page, description: item.content || '' };
        }
        
        try {
          metadata = item.metadata ? JSON.parse(item.metadata) : {};
        } catch (e) {
          metadata = {};
        }

        pageContent.sections[item.section] = {
          id: item.id,
          type: item.content_type,
          content: contentData,
          metadata: metadata,
          rawContent: item.content,
          lastModified: item.updated_at
        };

      } catch (error) {
        console.error('Error processing page content:', error, item);
      }
    });

    res.json({
      status: 'Success',
      data: {
        page: pageContent
      }
    });

  } catch (error) {
    console.error('Get page content error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch page content'
    });
  }
});

module.exports = router;