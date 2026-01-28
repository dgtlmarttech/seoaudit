// utils/seoUtils.js

/**
 * Safely extracts content from a regex match, trims it, and decodes HTML entities.
 * @param {Array | null} match The regex match array.
 * @returns {string | null} The cleaned content or null if no match.
 */
const getCleanedMatchContent = (match) => {
    if (!match || typeof match[1] !== 'string') {
        return null;
    }
    const decoded = decodeHtmlEntities(match[1].trim());
    return decoded === '' ? null : decoded; // Return null if content is just whitespace after trim
};

/**
 * Decodes HTML entities (e.g., &amp; to &).
 * @param {string} html The string with HTML entities.
 * @returns {string} The string with decoded entities.
 */
const decodeHtmlEntities = (html) => {
    if (typeof html !== 'string') return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
};

/**
 * Checks standard meta tags for SEO analysis.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {object} An object containing meta tag data.
 */
export const checkMetaTags = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkMetaTags: sourceCode must be a string.");
        return {
            title: { content: null, length: 0 },
            description: { content: null, length: 0 },
            charset: { content: null },
            robots: { content: null },
            viewport: { content: null },
            googleSiteVerification: { content: null },
            facebookDomainVerification: { content: null }
        };
    }

    // Updated regular expressions for robustness:
    // - Handles variations in attribute order, spaces, single/double quotes, self-closing tags.
    // - `[\s\S]*?` for content to match across newlines.
    const titleMatch = /<title[^>]*>\s*([\s\S]*?)\s*<\/title>/i.exec(sourceCode);
    const descriptionMatch = /<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const charsetMatch = /<meta[^>]+charset=["']?([a-zA-Z0-9\-_]+)["']?[^>]*>/i.exec(sourceCode);
    const robotsMatch = /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+?)["'][^>]*>/i.exec(sourceCode);
    const viewportMatch = /<meta[^>]+name=["']viewport["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const googleSiteVerificationMatch = /<meta[^>]+name=["']google-site-verification["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const facebookDomainVerificationMatch = /<meta[^>]+name=["']facebook-domain-verification["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);

    const titleContent = getCleanedMatchContent(titleMatch);
    const descriptionContent = getCleanedMatchContent(descriptionMatch);
    const charsetContent = getCleanedMatchContent(charsetMatch);
    const robotsContent = getCleanedMatchContent(robotsMatch);
    const viewportContent = getCleanedMatchContent(viewportMatch);
    const googleSiteVerificationContent = getCleanedMatchContent(googleSiteVerificationMatch);
    const facebookDomainVerificationContent = getCleanedMatchContent(facebookDomainVerificationMatch);

    return {
        title: {
            content: titleContent,
            length: titleContent ? titleContent.length : 0,
        },
        description: {
            content: descriptionContent,
            length: descriptionContent ? descriptionContent.length : 0,
        },
        charset: {
            content: charsetContent,
        },
        robots: {
            content: robotsContent,
        },
        viewport: {
            content: viewportContent,
        },
        googleSiteVerification: {
            content: googleSiteVerificationContent,
        },
        facebookDomainVerification: {
            content: facebookDomainVerificationContent,
        }
    };
};

/**
 * Checks Twitter Card meta tags.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {object} An object containing Twitter Card data.
 */
export const checkTwitterCards = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkTwitterCards: sourceCode must be a string.");
        return { card: null, title: null, description: null, image: null, site: null };
    }

    const cardMatch = /<meta[^>]+name=["']twitter:card["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const titleMatch = /<meta[^>]+name=["']twitter:title["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const descriptionMatch = /<meta[^>]+name=["']twitter:description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const imageMatch = /<meta[^>]+name=["']twitter:image["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const siteMatch = /<meta[^>]+name=["']twitter:site["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);

    return {
        card: getCleanedMatchContent(cardMatch),
        title: getCleanedMatchContent(titleMatch),
        description: getCleanedMatchContent(descriptionMatch),
        image: getCleanedMatchContent(imageMatch),
        site: getCleanedMatchContent(siteMatch),
    };
};

/**
 * Checks Open Graph meta tags.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {object} An object containing Open Graph data.
 */
export const checkOpenGraph = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkOpenGraph: sourceCode must be a string.");
        return { title: null, description: null, image: null, url: null, type: null, sitename: null, locale: null };
    }

    const titleMatch = /<meta[^>]+property=["']og:title["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const descriptionMatch = /<meta[^>]+property=["']og:description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const imageMatch = /<meta[^>]+property=["']og:image["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const urlMatch = /<meta[^>]+property=["']og:url["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const typeMatch = /<meta[^>]+property=["']og:type["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const sitenameMatch = /<meta[^>]+property=["']og:site_name["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);
    const localeMatch = /<meta[^>]+property=["']og:locale["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(sourceCode);

    return {
        title: getCleanedMatchContent(titleMatch),
        description: getCleanedMatchContent(descriptionMatch),
        image: getCleanedMatchContent(imageMatch),
        url: getCleanedMatchContent(urlMatch),
        type: getCleanedMatchContent(typeMatch),
        sitename: getCleanedMatchContent(sitenameMatch),
        locale: getCleanedMatchContent(localeMatch),
    };
};

/**
 * Checks image tags (img and favicons) for SEO relevance.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {object} An object containing image and favicon data.
 */
export const checkImageTags = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkImageTags: sourceCode must be a string.");
        return { faviconResults: [], imageResults: [] };
    }

    // Match all <img> tags, including those with optional quotes and self-closing
    const imgTags = sourceCode.match(/<img(?:\s+[^>]*?)?\s*(?:src=["']([^"']*)["']|data-src=["']([^"']*)["'])(?:\s+[^>]*?)?\s*(?:alt=["']([^"']*)["'])?[^>]*>/gi) || [];

    const imageResults = imgTags.map((imgTag) => {
        const srcMatch = /src=["']([^"']*)["']/i.exec(imgTag);
        const dataSrcMatch = /data-src=["']([^"']*)["']/i.exec(imgTag);
        const altMatch = /alt=["']([^"']*)["']/i.exec(imgTag);

        const srcDecoded = srcMatch ? decodeHtmlEntities(srcMatch[1].trim()) : null;
        const dataSrcDecoded = dataSrcMatch ? decodeHtmlEntities(dataSrcMatch[1].trim()) : null;

        const finalSrc = dataSrcDecoded || srcDecoded;
        const altText = altMatch ? decodeHtmlEntities(altMatch[1].trim()) : ''; // Default to empty string if no alt

        return {
            type: 'Image',
            alt: altText, // Ensure alt is meaningful
            src: finalSrc, // Use the final src (either data-src or src)
            imgElement: imgTag, // Return the entire <img> tag
        };
    });

    // Match all <link> tags that define icons (case-insensitive rel)
    const linkTags = sourceCode.match(/<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon|mask-icon)["'][^>]*href=["']([^"']+)["'][^>]*>/gi) || [];
    const faviconResults = linkTags.map((linkTag) => {
        const relMatch = /rel=["']([^"']+)["']/i.exec(linkTag);
        const hrefMatch = /href=["']([^"']+)["']/i.exec(linkTag);

        return {
            type: 'Favicon',
            rel: relMatch ? relMatch[1].trim() : 'Not Found',
            href: hrefMatch ? decodeHtmlEntities(hrefMatch[1].trim()) : 'Not Found',
        };
    });

    return { faviconResults, imageResults };
};

/**
 * Checks indexation related information.
 * @param {string} sourceCode The full HTML source code of the page.
 * @param {string} url The URL of the page.
 * @param {string | null} robotsContent The content of robots.txt, if available.
 * @param {string | null} sitemapContent The content of the sitemap, if available.
 * @returns {object} An object containing indexation data.
 */
export const checkIndexation = async (sourceCode, url, robotsContent, sitemapContent) => {
    // Basic validation
    if (typeof sourceCode !== 'string' || typeof url !== 'string') {
        console.error("checkIndexation: sourceCode and url must be strings.");
        return { robotsContent: null, sitemapConfirmation: null };
    }

    // `robots` and `sitemap` parameters are already the content, so just use them directly.
    // The previous implementation already passes the content directly, so no change needed here.
    return {
        robotsContent: robotsContent || 'Not Provided',
        sitemapConfirmation: sitemapContent || 'Not Provided', // Renamed for clarity, matches parameter
    };
};

/**
 * Checks internal and external links on the page.
 * @param {string} sourceCode The full HTML source code of the page.
 * @param {string} url The URL of the page being analyzed.
 * @returns {Array<object>} An array of link data.
 */
export const checkLinks = (sourceCode, url) => {
    if (typeof sourceCode !== 'string' || typeof url !== 'string') {
        console.error("checkLinks: sourceCode and url must be strings.");
        return [];
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch (error) {
        console.error(`checkLinks: Invalid base URL provided: ${url}`, error);
        return []; // Return empty array if base URL is invalid
    }
    const currentDomain = parsedUrl.hostname;

    // Match all anchor tags, including those with nofollow, noreferrer, etc.
    const anchorMatches = [...sourceCode.matchAll(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi)];

    const Data = anchorMatches.map((match, index) => {
        let href = match[1]; // Extract the href from the anchor tag
        const element = match[0]; // Entire anchor element

        // Decode HTML entities in href to handle &#038; etc.
        href = decodeHtmlEntities(href);

        // Check if the link is an anchor or relative path
        if (href.startsWith('#')) {
            return {
                sNo: index + 1,
                link: href,
                linkType: 'Anchor', // Specific type for on-page anchors
                isNoFollow: element.includes('rel="nofollow"'),
                isHidden: element.includes('display:none') || element.includes('visibility:hidden'),
                element,
            };
        } else if (href.startsWith('/')) {
            // For relative links, prepend the origin
            href = `${parsedUrl.origin}${href}`;
        } else if (!href.match(/^(https?|mailto|tel|ftp):/i)) {
            // Handle protocol-less absolute URLs (e.g., "//example.com/path")
            // Or assume http for truly relative paths not starting with /
            href = `${parsedUrl.protocol}//${href.startsWith('//') ? href.substring(2) : href}`;
        }


        // Check if the link is a telephone number (starts with 'tel:') or mailto
        if (href.startsWith('tel:') || href.startsWith('mailto:')) {
            return {
                sNo: index + 1,
                link: href,
                linkType: href.startsWith('tel:') ? 'Telephone' : 'Email',
                isNoFollow: element.includes('rel="nofollow"'),
                isHidden: element.includes('display:none') || element.includes('visibility:hidden'),
                element,
            };
        }

        // Parse the href after ensuring it's absolute
        let parsedLink;
        try {
            parsedLink = new URL(href);
        } catch (error) {
            console.warn(`checkLinks: Could not parse URL "${href}" from element: "${element}"`, error);
            return {
                sNo: index + 1,
                link: href,
                linkType: 'Invalid/Malformed URL',
                isNoFollow: element.includes('rel="nofollow"'),
                isHidden: element.includes('display:none') || element.includes('visibility:hidden'),
                element,
            };
        }

        // Determine if the link is internal (same domain) or external (different domain)
        // Normalize hostnames (remove www. for comparison)
        const normalizeHostname = (hostname) => hostname.replace(/^www\./, '');
        const isInternal = normalizeHostname(parsedLink.hostname) === normalizeHostname(currentDomain);

        // Check if the link has rel="nofollow"
        const isNoFollow = element.includes('rel="nofollow"');

        // Check if the link is hidden (using inline CSS or hidden attribute)
        const isHidden = element.includes('display:none') || element.includes('visibility:hidden') || element.includes('hidden');

        // Return the data for each anchor tag
        return {
            sNo: index + 1,
            link: href,
            linkType: isInternal ? 'Internal' : 'External',
            isNoFollow,
            isHidden,
            element,
        };
    });

    return Data;
};

/**
 * Checks for SEO optimization elements like canonical links, alternate links, and schema markup.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {object} An object containing SEO optimization data.
 */
export const checkSearchOptimization = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkSearchOptimization: sourceCode must be a string.");
        return { canonicalLinks: [], alternateLinks: [], headSchema: [], bodySchema: [] };
    }

    // Extract all canonical links (entire <link> element)
    const canonicalMatches = [...sourceCode.matchAll(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/gi)];
    const canonicalLinks = canonicalMatches.map(match => decodeHtmlEntities(match[0].trim()));

    // Extract all alternate links (entire <link> element, including type and title attributes)
    const alternateMatches = [...sourceCode.matchAll(/<link[^>]+rel=["']alternate["'][^>]*>/gi)];
    const alternateLinks = alternateMatches.map(match => decodeHtmlEntities(match[0].trim()));

    let headSchema = [];
    let bodySchema = [];

    // Extract all schema markups from the <head> section
    const headContentMatch = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(sourceCode);
    if (headContentMatch && typeof headContentMatch[1] === "string") {
        const headScriptTags = [...headContentMatch[1].matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
        headSchema = headScriptTags.map(tag => decodeHtmlEntities(tag[0].trim()));
    }

    // Extract all schema markups from the <body> section
    const bodyContentMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(sourceCode);
    if (bodyContentMatch && typeof bodyContentMatch[1] === "string") {
        const bodyScriptTags = [...bodyContentMatch[1].matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
        bodySchema = bodyScriptTags.map(tag => decodeHtmlEntities(tag[0].trim()));
    }

    return {
        canonicalLinks,
        alternateLinks,
        headSchema,
        bodySchema,
    };
};

/**
 * Checks URL vulnerability based on specific patterns (lowercase, underscores, duplicate slashes).
 * Excludes social media links from the check.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {Array<object>} An array of URL vulnerability data.
 */
export const checkURLVulnerability = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkURLVulnerability: sourceCode must be a string.");
        return [];
    }

    const anchorMatches = [...sourceCode.matchAll(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi)];

    // Social media domains to be excluded (ensure they are base domains for broader matching)
    const socialMediaPlatforms = [
        'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'pinterest.com',
        'youtube.com', 'tiktok.com', 'reddit.com', 'snapchat.com' // Expanded list
    ];

    const anchorData = anchorMatches
        .map((match) => {
            let href = match[1];
            href = decodeHtmlEntities(href).trim(); // Decode and trim href for accurate checks

            // Attempt to create a URL object to get hostname for robust social media exclusion
            let linkHostname = '';
            try {
                const urlObj = new URL(href.startsWith('//') ? `https:${href}` : href); // Add protocol if missing
                linkHostname = urlObj.hostname.replace(/^www\./, '');
            } catch (e) {
                // If URL parsing fails, it's likely an invalid link or relative, don't exclude by domain
                linkHostname = '';
            }

            // Exclude social media links based on the domain
            const isSocialMedia = socialMediaPlatforms.some(platform => linkHostname.includes(platform));

            return { href, isSocialMedia }; // Return processed href and social status
        })
        .filter(linkInfo => !linkInfo.isSocialMedia) // Filter out social media links
        .map((linkInfo, index) => {
            const { href } = linkInfo;

            // Check conditions
            const isLowerCase = href === href.toLowerCase();
            const hasUnderscores = href.includes('_');
            // Check for duplicate slashes, excluding protocol part (https://)
            const hasDuplicateSlashes = /(?<!:)\/{2,}/.test(href.replace(/^(https?|ftp):\/\//i, ''));

            return {
                sNo: index + 1,
                link: href,
                isLowerCase: isLowerCase ? '&#10003;' : '&#10007;',
                hasUnderscores: hasUnderscores ? '&#10007;' : '&#10003;',
                hasDuplicateSlashes: hasDuplicateSlashes ? '&#10007;' : '&#10003;',
                isValid: isLowerCase && !hasUnderscores && !hasDuplicateSlashes,
            };
        });

    return anchorData;
};


/**
 * Checks for social network links on the page.
 * This version uses a robust regex for <a> tags and relies on URL parsing for identification.
 * All console logs have been removed.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {Array<object>} An array of social link data.
 */
export const checkSocialNetworks = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        // Log an error, but don't stop execution or throw for a utility function
        console.error("checkSocialNetworks: sourceCode must be a string.");
        return [];
    }

    // Extremely broad regex to capture ALL <a> tags and their href attribute.
    // It's flexible with whitespace and other attributes.
    const anchorHrefMatches = [...sourceCode.matchAll(/<a[^>]*?href=["']([^"']+)["'][^>]*>/gi)];

    // List of social domains we care about for identification
    const socialDomains = {
        'facebook.com': 'Facebook',
        'fb.com': 'Facebook',
        'twitter.com': 'Twitter',
        'x.com': 'X (Twitter)',
        'instagram.com': 'Instagram',
        'linkedin.com': 'LinkedIn',
        'pinterest.com': 'Pinterest',
        'youtube.com': 'YouTube', // Direct domain
        'youtu.be': 'YouTube', // YouTube short links
        'tiktok.com': 'TikTok',
        'reddit.com': 'Reddit',
        'snapchat.com': 'Snapchat',
        // Add other common social media domains if needed
    };

    const socialData = [];

    anchorHrefMatches.forEach((match) => {
        const rawHref = match[1]; // The captured href value

        const href = decodeHtmlEntities(rawHref).trim();

        let platform = null;
        let parsedUrl;

        try {
            // Ensure the URL has a protocol, otherwise new URL() might fail for relative paths
            let fullHref = href;
            if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
                fullHref = `https://${href}`;
            } else if (href.startsWith('//')) {
                fullHref = `https:${href}`;
            }

            parsedUrl = new URL(fullHref);
            const hostname = parsedUrl.hostname.replace(/^www\./, ''); // Remove 'www.' for consistent matching

            // Check if the hostname matches any of our social domains
            for (const domain in socialDomains) {
                if (hostname.includes(domain)) {
                    platform = socialDomains[domain];
                    break;
                }
            }
        } catch (e) {
            // Silently fail for invalid URLs within this loop
        }

        if (platform) {
            // We are not capturing linkInnerHtml with this regex, so remove that from the push
            socialData.push({
                sNo: socialData.length + 1,
                link: href,
                platform: platform,
            });
        }
    });

    return socialData;
};


/**
 * Checks for a custom 404 page.
 * @param {string} sourceCode The full HTML source code of the main page (not the 404 page directly).
 * @param {string} url The URL of the page being analyzed.
 * @param {string | null} robotsContent The content of robots.txt.
 * @param {string | null} sitemapContent The content of the sitemap.
 * @param {string} page404Content The actual content of the fetched 404 page.
 * @param {string[]} customIndicators Custom keywords to identify a 404 page.
 * @returns {object} An object indicating if it's a custom 404 and additional conditions.
 */
export const checkCustom404 = (sourceCode, url, robotsContent, sitemapContent, page404Content, customIndicators = [
    'oops', 'page not found', 'we couldn\'t find', '404 error', 'back to homepage', 'sorry', 'lost in space',
    'something went wrong', 'we\'re sorry', 'oops! page not found', 'this page is lost',
    'we can\'t find the page', 'unable to locate', 'broken link', 'we could not locate',
    'error 404', 'not found', 'The requested URL was not found on this server', // Common server default messages
    'resource not found'
]) => {
    if (typeof page404Content !== 'string') {
        console.error("checkCustom404: page404Content must be a string.");
        return { custom404: 'UNKNOWN', additionalConditions: { is404InSourceCode: null, isRobotsBlocked: null, isInSitemap: null } };
    }

    // Check if the 404 page content contains any of the custom indicators (case-insensitive)
    const isCustom404 = customIndicators.some(indicator =>
        page404Content.toLowerCase().includes(indicator.toLowerCase())
    );

    // Check additional conditions for further analysis
    const checkAdditionalConditions = () => {
        // Check main page source code for a "404" or "not found" message (unlikely for a real 404)
        const is404InMainSourceCode = sourceCode && /404|not found/i.test(sourceCode);

        // Check robots.txt for any disallowed pages relevant to the URL
        const isRobotsBlocked = robotsContent && new RegExp(`Disallow:\\s*${new URL(url).pathname.replace(/\//g, '\\/')}`, 'i').test(robotsContent);

        // Check sitemap to see if the page is listed (should not be for a 404)
        const isInSitemap = sitemapContent && sitemapContent.includes(url);

        return {
            is404InMainSourceCode,
            isRobotsBlocked,
            isInSitemap,
        };
    };

    const additionalConditions = checkAdditionalConditions();

    // Return a detailed result object
    return {
        custom404: isCustom404 ? 'YES' : 'NO',
        additionalConditions,
    };
};

/**
 * Checks domain characteristics for SEO friendliness.
 * @param {string} sourceCode The full HTML source code of the page (though not directly used in this specific function, it's passed consistently).
 * @param {string} url The URL of the page being analyzed.
 * @returns {object} An object containing domain analysis data.
 */
export const checkDomains = (sourceCode, url) => {
    console.log("checkDomains: Starting domain check for URL:", url);

    // --- NEW DIAGNOSTIC LOGGING ---
    if (typeof url === 'string') {
        console.log("checkDomains: URL character codes:", url.split('').map(c => c.charCodeAt(0)));
    }
    // --- END NEW DIAGNOSTIC LOGGING ---

    if (typeof url !== 'string' || url.trim() === '') {
        console.error("checkDomains: URL must be a string or is empty.");
        return {
            status: 'Failed',
            message: 'Invalid URL. Please provide a valid URL.',
            report: 'URL parameter is not a string or is empty.',
            domain: null,
            domainLength: 0,
            specialCharacters: 'Unknown',
            subdomains: 'Unknown',
        };
    }

    try {
        // This is the line where the error is reported in your stack trace (or very close to it)
        const parsedUrl = new URL(url);
        const domain = parsedUrl.hostname;

        // Remove 'www.' and common TLDs for analysis. Using a more robust TLD removal.
        let cleanedDomain = domain.replace(/^www\./i, ''); // Remove 'www.' case-insensitively
        // Simple TLD removal (can be extended with a more comprehensive list)
        // Added .pk as you previously mentioned dgtlmart.com is in Pakistan
        cleanedDomain = cleanedDomain.replace(/\.(com|org|net|io|co|in|gov|edu|info|biz|dev|app|ai|pk|com\.pk)$/i, '');

        // Calculate the cleaned domain length (excluding TLD and www)
        const domainLength = cleanedDomain.length;

        // Check for special characters (allow hyphens, which are common in domains)
        const hasSpecialCharacters = /[^a-zA-Z0-9-]/.test(cleanedDomain);

        // Check for subdomains (if there are multiple dots in the cleaned domain name after removing www and top-level TLD)
        // A more precise check: count parts after removing common TLDs. If more than one part, it has subdomains.
        const domainParts = domain.split('.');
        const hasSubdomains = domainParts.length > 2 && !/^www\./i.test(domain); // e.g., sub.example.com has 3 parts

        // Evaluate each SEO criterion
        const seoFriendlyLength = domainLength >= 2 && domainLength <= 63; // Min 2 characters for actual domain name (e.g., go.com)
        const seoFriendlySpecialCharacters = !hasSpecialCharacters;
        const seoFriendlySubdomains = !hasSubdomains;

        // Generate detailed reasons for SEO friendliness or issues
        const reasons = [];

        if (seoFriendlyLength) {
            reasons.push(`The domain length (${domainLength} characters, excluding TLD and 'www') is within the SEO-friendly range (2-63 characters).`);
        } else {
            reasons.push(`The domain length (${domainLength} characters, excluding TLD and 'www') is not within the SEO-friendly range.`);
        }

        if (seoFriendlySpecialCharacters) {
            reasons.push("The domain does not contain problematic special characters (only hyphens allowed), which is good for SEO.");
        } else {
            reasons.push("The domain contains problematic special characters (other than hyphens), which can negatively impact SEO.");
        }

        if (seoFriendlySubdomains) {
            reasons.push("The domain does not have subdomains (beyond 'www'), making it generally more SEO-friendly.");
        } else {
            reasons.push("The domain contains subdomains, which can sometimes negatively impact SEO depending on usage.");
        }

        // Overall SEO status
        const isSeoFriendly =
            seoFriendlyLength && seoFriendlySpecialCharacters && seoFriendlySubdomains;

        return {
            domain: domain, // Return the original domain for clarity
            domainLength: domainLength,
            specialCharacters: hasSpecialCharacters ? 'Contains' : 'None',
            subdomains: hasSubdomains ? 'Contains' : 'None',
            status: isSeoFriendly ? 'Success' : 'Failed',
            message: isSeoFriendly
                ? 'The domain is SEO-friendly.'
                : 'The domain has issues affecting SEO.',
            report: reasons.join(' '), // Combine all reasons into a single report
        };

    } catch (error) {
        console.error(`checkDomains: Failed to parse URL "${url}". Error: ${error.message}`);
        return {
            status: `Failed`,
            message: `Invalid URL provided. Please ensure it is a valid URL format (e.g., https://example.com).`,
            report: `The URL "${url}" could not be processed due to: ${error.message}`,
            domain: null,
            domainLength: 0,
            specialCharacters: 'Unknown',
            subdomains: 'Unknown',
        };
    }
};

/**
 * Checks heading tags (h1-h6) content.
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {object} An object containing arrays of heading tag content.
 */
export const checkHeadingTags = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkHeadingTags: sourceCode must be a string.");
        return { h1: 'Not Found', h2: 'Not Found', h3: 'Not Found', h4: 'Not Found', h5: 'Not Found', h6: 'Not Found' };
    }

    // Function to remove all HTML tags except the text content
    const removeHtmlTags = (html) => {
        // Remove script and style tags first to avoid parsing their content
        let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        return cleaned.replace(/<[^>]+>/g, '').trim();
    };

    const getHeadings = (tag, source) => {
        const matches = [...source.matchAll(new RegExp(`<${tag}[^>]*>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`, 'gi'))];
        return matches.map(match => {
            const rawContent = match[1];
            const cleanedContent = removeHtmlTags(rawContent);
            return decodeHtmlEntities(cleanedContent);
        }).filter(content => content !== ''); // Filter out empty strings after cleaning
    };

    const h1Headings = getHeadings('h1', sourceCode);
    const h2Headings = getHeadings('h2', sourceCode);
    const h3Headings = getHeadings('h3', sourceCode);
    const h4Headings = getHeadings('h4', sourceCode);
    const h5Headings = getHeadings('h5', sourceCode);
    const h6Headings = getHeadings('h6', sourceCode);

    return {
        h1: h1Headings.length > 0 ? h1Headings : 'Not Found',
        h2: h2Headings.length > 0 ? h2Headings : 'Not Found',
        h3: h3Headings.length > 0 ? h3Headings : 'Not Found',
        h4: h4Headings.length > 0 ? h4Headings : 'Not Found',
        h5: h5Headings.length > 0 ? h5Headings : 'Not Found',
        h6: h6Headings.length > 0 ? h6Headings : 'Not Found',
    };
};

/**
 * Checks for security concerns, specifically links with target="_blank" that lack rel="noopener noreferrer".
 * @param {string} sourceCode The full HTML source code of the page.
 * @returns {Array<object>} An array of potentially vulnerable links with their `rel` attributes.
 */
export const checkSecurity = (sourceCode) => {
    if (typeof sourceCode !== 'string') {
        console.error("checkSecurity: sourceCode must be a string.");
        return [];
    }

    // Match all <a> tags with target="_blank"
    const linksWithBlankTarget = [...sourceCode.matchAll(/<a\s+[^>]*target=["']_blank["'][^>]*>/gi)];

    const securityIssues = linksWithBlankTarget.map(match => {
        const anchorTag = match[0]; // The entire <a> tag
        const hrefMatch = /href=["']([^"']*)["']/i.exec(anchorTag);
        const relMatch = /rel=["']([^"']*)["']/i.exec(anchorTag);

        const href = hrefMatch ? decodeHtmlEntities(hrefMatch[1]).trim() : 'Not Found';
        const relAttribute = relMatch ? relMatch[1].trim() : '';

        // Check if rel attribute contains noopener or noreferrer
        const hasNoopener = /\bnopener\b/i.test(relAttribute);
        const hasNoreferrer = /\bnoreferrer\b/i.test(relAttribute);

        return {
            element: anchorTag,
            href: href,
            rel: relAttribute,
            hasNoopener: hasNoopener ? '&#10003;' : '&#10007;',
            hasNoreferrer: hasNoreferrer ? '&#10003;' : '&#10007;',
            isVulnerable: !(hasNoopener && hasNoreferrer) // Considered vulnerable if both are not present
        };
    });

    // Filter to only return actual vulnerabilities (missing both or one of them)
    return securityIssues.filter(item => item.isVulnerable);
};