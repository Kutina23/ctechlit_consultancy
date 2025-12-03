import React from "react";
import { Image, Video, Music, FileText } from "lucide-react";

/**
 * Reusable media display component for showing uploaded images and videos
 * @param {Object} props - Component props
 * @param {string} props.src - Source URL for the media
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.type - Media type ('image', 'video', 'audio', 'document')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {boolean} props.autoplay - Whether to autoplay video/audio
 * @param {boolean} props.controls - Whether to show video/audio controls
 * @param {Function} props.onLoad - Callback when media loads
 * @param {Function} props.onError - Callback when media fails to load
 */
const MediaDisplay = ({
  src,
  alt = "",
  type = "image",
  className = "",
  style = {},
  autoplay = false,
  controls = true,
  onLoad,
  onError,
  ...props
}) => {
  // Generate placeholder for broken images
  const handleError = (e) => {
    console.error("Media failed to load:", src);
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  // Render different media types
  switch (type) {
    case "video":
      return (
        <video
          src={src}
          className={className}
          style={style}
          controls={controls}
          autoPlay={autoplay}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        >
          Your browser does not support the video tag.
        </video>
      );

    case "audio":
      return (
        <audio
          src={src}
          className={className}
          style={style}
          controls={controls}
          autoPlay={autoplay}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        >
          Your browser does not support the audio tag.
        </audio>
      );

    case "image":
    default:
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      );
  }
};

/**
 * Media thumbnail component for grid displays
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object with src, type, alt properties
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {boolean} props.clickable - Whether the thumbnail is clickable
 * @param {Function} props.onClick - Click handler
 */
export const MediaThumbnail = ({
  media,
  size = "md",
  clickable = true,
  onClick,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const getIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className={`${iconSizes[size]} text-white`} />;
      case "audio":
        return <Music className={`${iconSizes[size]} text-white`} />;
      case "document":
        return <FileText className={`${iconSizes[size]} text-white`} />;
      case "image":
      default:
        return <Image className={`${iconSizes[size]} text-white`} />;
    }
  };

  const thumbnailContent = (
    <div
      className={`
      ${sizeClasses[size]} 
      bg-gradient-to-br from-cyan-400 to-purple-500 
      rounded-lg flex items-center justify-center overflow-hidden
      ${clickable ? "cursor-pointer hover:scale-105" : ""}
      transition-transform duration-200
      ${className}
    `}
    >
      {media.type === "image" ? (
        <MediaDisplay
          src={media.url || media.src}
          alt={media.alt || media.filename}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to icon if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ display: media.type === "image" ? "none" : "flex" }}
      >
        {getIcon(media.type)}
      </div>
    </div>
  );

  if (clickable && onClick) {
    return (
      <button
        onClick={() => onClick(media)}
        className="bg-transparent border-0 p-0 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
        {...props}
      >
        {thumbnailContent}
      </button>
    );
  }

  return thumbnailContent;
};

/**
 * Media grid component for displaying multiple media items
 * @param {Object} props - Component props
 * @param {Array} props.media - Array of media objects
 * @param {string} props.columns - Grid columns class
 * @param {Function} props.renderItem - Custom render function for each item
 * @param {Function} props.onItemClick - Click handler for items
 */
export const MediaGrid = ({
  media = [],
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  renderItem,
  onItemClick,
  className = "",
}) => {
  if (media.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No media files available</p>
      </div>
    );
  }

  return (
    <div className={`grid ${columns} gap-4 ${className}`}>
      {media.map((item, index) => (
        <div key={item.id || index}>
          {renderItem ? (
            renderItem(item, index)
          ) : (
            <MediaThumbnail media={item} onClick={onItemClick} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaDisplay;
