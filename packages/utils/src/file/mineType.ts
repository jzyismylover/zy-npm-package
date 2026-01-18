/**
 * 图片 mime 类型
 */
export const IMAGE_MIME_TYPES = {
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    ico: "image/x-icon",
    avif: "image/avif",
    jfif: "image/jfif",
} as const;

/**
 * 其他文件 mime 类型
 */
export const MIME_TYPES = {
    json: 'application/json',
    // image
    ...IMAGE_MIME_TYPES,
} as const;