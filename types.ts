// src/types.ts

/**
 * Interface for RandomPic API arguments
 */
export interface RandomPicArgs {
    /**
     * 图片类型 (Optional).
     * 'all': 所有正常图 (默认)
     * 'mp': 竖屏壁纸
     * 'pc': 横屏壁纸
     * 'silver': 银发
     * 'furry': 兽耳
     * 'r18': R18 图 (需要 type=json)
     * 'pixiv': P站随机图
     * 'jitsu': Jitsu 收藏
     * @items.enum ["all", "mp", "pc", "silver", "furry", "r18", "pixiv", "jitsu"]
     * @default ["all"]
     * @example ["r18", "furry"]
     */
    sort?: ("all" | "mp" | "pc" | "silver" | "furry" | "r18" | "pixiv" | "jitsu")[]; // Changed to array

    /**
     * 图片规格 (Optional).
     * 非 R18: 'large'(默认), 'mw2048', 'mw1024', 'mw690', 'small', 'bmiddle', 'thumb180', 'square'
     * R18: 'original', 'regular'(默认), 'thumb', 'small'
     * 注意：如果想忽略此参数以加快响应，请在 URL 中使用 /api/ 而不是 /img/ (通过 useApiEndpoint 参数控制)
     * @enum ["large", "mw2048", "mw1024", "mw690", "small", "bmiddle", "thumb180", "square", "original", "regular", "thumb"]
     */
    size?: "large" | "mw2048" | "mw1024" | "mw690" | "small" | "bmiddle" | "thumb180" | "square" | "original" | "regular" | "thumb"; // 'small' is duplicated but valid for both

    /**
     * 返回格式 (Optional).
     * 'json': 返回 JSON 数据 (建议使用, R18 强制使用)
     * undefined: 302 跳转到图片 URL (默认)
     * @enum ["json"]
     */
    type?: "json";

    /**
     * 返回数量 (Optional). 仅在 type='json' 时有效.
     * @minimum 1
     * @maximum 100
     * @default 1
     */
    num?: number;

     /**
     * 是否使用 /api/ 端点 (Optional).
     * true: 使用 https://moe.jitsu.top/api/ (忽略 size 参数，可能更快)
     * false: 使用 https://moe.jitsu.top/img/ (默认)
     * @default false
     */
     useApiEndpoint?: boolean;

    /**
     * 是否在响应中包含图片的 Base64 编码 (Optional).
     * true: 下载图片并将其 Base64 编码后包含在响应的 content 中 (类型为 image)。
     * false: 仅返回图片的 Markdown 链接 (默认)。
     * 注意：设置为 true 会显著增加 Token 消耗和处理时间。
     * @default false
     */
    include_base64?: boolean;
}

/**
 * Validates arguments for the get_random_pic tool
 * @param {any} args - The arguments to validate
 * @returns {boolean} - Whether the arguments are valid
 */
export function isValidRandomPicArgs(args: any): args is RandomPicArgs {
    if (!args || typeof args !== 'object') return false;

    const validSorts = ["all", "mp", "pc", "silver", "furry", "r18", "pixiv", "jitsu"];
    // Validate sort if provided (must be an array of valid strings)
    if (args.sort !== undefined) {
        if (!Array.isArray(args.sort)) return false;
        if (args.sort.length === 0) return false; // Must have at least one sort if provided
        for (const s of args.sort) {
            if (typeof s !== 'string' || !validSorts.includes(s)) return false;
        }
        // R18 must use type=json if r18 is included in the sort array
        if (args.sort.includes('r18') && args.type !== 'json') return false;
    }


    const validSizes = ["large", "mw2048", "mw1024", "mw690", "small", "bmiddle", "thumb180", "square", "original", "regular", "thumb"];
    if (args.size !== undefined && (typeof args.size !== 'string' || !validSizes.includes(args.size))) return false;

    if (args.type !== undefined && args.type !== 'json') return false;

    if (args.num !== undefined) {
        const num = Number(args.num);
        if (!Number.isInteger(num) || num < 1 || num > 100) return false;
        // num is only valid if type is json
        if (args.type !== 'json') return false;
    }


    // Validate size based on sort (if both provided and sort is not empty)
    // This logic might be complex if multiple sorts are allowed with different size rules.
    // For now, let's assume the API handles mixed sort/size conflicts gracefully or we prioritize R18 rules if 'r18' is present.
    if (args.sort && args.sort.includes('r18') && args.size !== undefined) {
        const validR18Sizes = ["original", "regular", "thumb", "small"];
        if (!validR18Sizes.includes(args.size)) return false;
    } else if (args.sort && !args.sort.includes('r18') && args.size !== undefined) { // Check size only if 'r18' is NOT present
        const validNonR18Sizes = ["large", "mw2048", "mw1024", "mw690", "small", "bmiddle", "thumb180", "square"];
        if (!validNonR18Sizes.includes(args.size)) return false;
    } // If 'r18' and other sorts are mixed, we skip non-r18 size validation for simplicity.

    if (args.useApiEndpoint !== undefined && typeof args.useApiEndpoint !== 'boolean') return false;

    if (args.include_base64 !== undefined && typeof args.include_base64 !== 'boolean') return false;

    return true;
}

// We might not need a specific interface to store results if we don't cache
// interface RandomPicResult {
//     requestArgs: RandomPicArgs;
//     imageUrls: string[];
//     timestamp: string;
//     response?: any; // Optional: store raw JSON response
// }
