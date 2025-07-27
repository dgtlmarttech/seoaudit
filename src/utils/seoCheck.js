// utils/seoUtils.js


export const checkMetaTags = (sourceCode) => {
  // Updated regular expressions to handle case variations and self-closing tags
  const title = /<title[^>]*>\s*(.*?)\s*<\/title>/i.exec(sourceCode);
  const description = /<meta\s+name=["']description["'][^>]*\s+content=["'](.*?)["']/i.exec(sourceCode);
  const charset = /<meta\s+(charset|charSet)["']?\s*=\s*["'](.*?)["']/i.exec(sourceCode);
  const robots = /<meta\s+name=["']robots["'][^>]*\s+content=["']([^"']+)["']/i.exec(sourceCode);
  const viewport = /<meta\s+name=["']viewport["'][^>]*\s+content=["'](.*?)["']/i.exec(sourceCode);
  const googleSiteVerification = /<meta\s+name=["']google-site-verification["'][^>]*\s+content=["'](.*?)["']/i.exec(sourceCode);
  const facebookDomainVerification = /<meta\s+name=["']facebook-domain-verification["'][^>]*\s+content=["'](.*?)["']/i.exec(sourceCode);
  
  return {
    title: {
      content: title ? title[1].trim() : null,
      length: title && title[1] ? title[1].length : 0,
    },
    description: {
      content: description ? description[1].trim() : null,
      length: description && description[1] ? description[1].length : 0,
    },
    charset: {
      content: charset ? charset[2].trim() : null,
    },
    robots: {
      content: robots ? robots[1].trim() : null,
    },
    viewport: {
      content: viewport ? viewport[1].trim() : null,
    },
    googleSiteVerification: {
      content: googleSiteVerification ? googleSiteVerification[1].trim() : null,
    },
    facebookDomainVerification: {
      content: facebookDomainVerification ? facebookDomainVerification[1].trim() : null,
    }
  };
};


  
  export const checkTwitterCards = (sourceCode) => {
    const card = /<meta name="twitter:card" content="(.*?)"/.exec(sourceCode);
    const title = /<meta name="twitter:title" content="(.*?)"/.exec(sourceCode);
    const description = /<meta name="twitter:description" content="(.*?)"/.exec(sourceCode);
    const image = /<meta name="twitter:image" content="(.*?)"/.exec(sourceCode);
    const site = /<meta name="twitter:site" content="(.*?)"/.exec(sourceCode);
  
    return {
      card: card ? card[1] : null,
      title: title ? title[1] : null,
      description: description ? description[1] : null,
      image: image ? image[1] : null,
      site: site ? site[1] : null,
    };
  };
  
  export const checkOpenGraph = (sourceCode) => {
    const title = /<meta property="og:title" content="(.*?)"/.exec(sourceCode);
    const description = /<meta property="og:description" content="(.*?)"/.exec(sourceCode);
    const image = /<meta property="og:image" content="(.*?)"/.exec(sourceCode);
    const url = /<meta property="og:url" content="(.*?)"/.exec(sourceCode);
    const type = /<meta property="og:type" content="(.*?)"/.exec(sourceCode);
    const sitename = /<meta property="og:site_name" content="(.*?)"/.exec(sourceCode);
    const locale = /<meta property="og:locale" content="(.*?)"/.exec(sourceCode);
  
    return {
      title: title ? title[1] : null,
      description: description ? description[1] : null,
      image: image ? image[1] : null,
      url: url ? url[1] : null,
      type: type ? type[1] : null,
      sitename: sitename ? sitename[1] : null,
      locale: locale ? locale[1] : null,
    };
  };
  
  export const checkImageTags = (sourceCode) => { 
    // Match all <img> tags
    const imgTags = sourceCode.match(/<img[^>]+>/gi) || [];
    const imageResults = imgTags.map((imgTag) => {
      // Use a flexible regular expression to match both single and double quotes
      const alt = /alt=['"](.*?)['"]/i.exec(imgTag);
      const src = /src=['"](.*?)['"]/i.exec(imgTag);
      const dataSrc = /data-src=['"](.*?)['"]/i.exec(imgTag);  // Capture data-src with either quote type
  
      // Decode the src and data-src to handle any encoded characters (like &#038;)
      const srcDecoded = src ? decodeURIComponent(src[1]) : null;
      const dataSrcDecoded = dataSrc ? decodeURIComponent(dataSrc[1]) : null;
  
      // Choose the correct src (prefer data-src if it exists)
      const finalSrc = dataSrcDecoded || srcDecoded;
  
      // Check if alt attribute is meaningful (i.e., non-empty and non-space)
      let altText = alt ? alt[1].trim() : '';
  
      return {
        type: 'Image',
        alt: altText,  // Ensure alt is meaningful
        src: finalSrc,  // Use the final src (either data-src or src)
        imgElement: imgTag, // Return the entire <img> tag
      };
    });
  
    // Match all <link> tags that define icons
    const linkTags = sourceCode.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]*>/gi) || [];
    const faviconResults = linkTags.map((linkTag) => {
      const rel = /rel=['"](.*?)['"]/i.exec(linkTag);
      const href = /href=['"](.*?)['"]/i.exec(linkTag);
  
      return {
        type: 'Favicon',
        rel: rel ? rel[1] : 'Not Found',
        href: href ? href[1] : 'Not Found',
      };
    });
  
    return {faviconResults, imageResults};
  };
  
  
  

  export const checkIndexation = async (sourceCode,url,robots,sitemap) => {
    const robotsContent = robots
    const sitemapContent = sitemap

    return {
      robotsContent: robotsContent,
      sitemapConfirmation: sitemapContent,
    };
  };
  

  
  export const checkLinks = (sourceCode, url) => {
    const parsedUrl = new URL(url);
    const currentDomain = parsedUrl.hostname; // Extract current domain from the provided URL
  
    // Match all anchor tags
    const anchorMatches = [...sourceCode.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g)];
  
    const Data = anchorMatches.map((match, index) => {
      let href = match[1]; // Extract the href from the anchor tag
      const element = match[0]; // Entire anchor element
  
      // Check if the link is an anchor or relative path
      if (href === '#' || href.startsWith('/')) {
        // For relative or anchor links, prepend the domain (make it absolute)
        href = href.startsWith('/') ? `${parsedUrl.origin}${href}` : url + href;
      }
  
      // Check if the link is a telephone number (starts with 'tel:')
      if (href.startsWith('tel:')) {
        return {
          sNo: index + 1,
          link: href,
          linkType: 'External', // Treat telephone numbers as external
          isHidden: false,
          element,
        };
      }
  
      // Parse the href after ensuring it's absolute
      let parsedLink;
      try {
        parsedLink = new URL(href); // Parse the URL to extract components like hostname
      } catch (error) {
        return {
          sNo: index + 1,
          link: href,
          linkType: 'Invalid',  // If URL parsing fails
          isHidden: false,
          element,
        };
      }
  
      // Determine if the link is internal (same domain) or external (different domain)
      const isInternal = parsedLink.hostname === currentDomain;
  
      // Check if the link is hidden (using inline CSS or hidden attribute)
      const isHidden = element.includes('display:none') || element.includes('visibility:hidden');
  
      // Return the data for each anchor tag
      return {
        sNo: index + 1,
        link: href,
        linkType: isInternal ? 'Internal' : 'External', // Mark as 'Internal' or 'External'
        isHidden,
        element,
      };
    });
  
    return Data;
  };
  
  
  export const checkSearchOptimization = (sourceCode) => {
    // Extract all canonical links (entire <link> element)
    const canonicalMatches = [...sourceCode.matchAll(/<link rel="canonical"[^>]*>/g)];
    const canonicalLinks = canonicalMatches.map(match => match[0]);

    // Extract all alternate links (entire <link> element, including type and title attributes)
    const alternateMatches = [...sourceCode.matchAll(/<link rel="alternate"[^>]*>/g)];
    const alternateLinks = alternateMatches.map(match => match[0]);

    let bodyScriptTags = [];
    let headScriptTags = [];

    // Extract all schema markups, splitting into head and body
    const headScriptMatch = [...sourceCode.matchAll(/<head[^>]*>([\s\S]*?)<\/head>/g)];
    if (headScriptMatch.length > 0 && typeof headScriptMatch[0][1] === "string") {
        headScriptTags = [...headScriptMatch[0][1].matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g)];
    }
    const headSchema = headScriptTags.map(tag => tag[0]);

    const bodyScriptMatch = [...sourceCode.matchAll(/<body[^>]*>([\s\S]*?)<\/body>/g)];
    if (bodyScriptMatch.length > 0 && typeof bodyScriptMatch[0][1] === "string") {
        bodyScriptTags = [...bodyScriptMatch[0][1].matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g)];
    }
    const bodySchema = bodyScriptTags.map(tag => tag[0]);

    return {
        canonicalLinks,
        alternateLinks,
        headSchema,
        bodySchema,
    };
};
  
export const checkURLVulnerability = (sourceCode) => {
  const anchorMatches = [...sourceCode.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g)];

  // Social media domains to be excluded
  const socialMediaPlatforms = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'pinterest.com'];

  const anchorData = anchorMatches
    .filter((match) => {
      const href = match[1];
      // Exclude social media links based on the domain
      return !socialMediaPlatforms.some(platform => href.includes(platform));
    })
    .map((match, index) => {
      const href = match[1];

      // Check conditions
      const isLowerCase = href === href.toLowerCase() ? '&#10003' : '&#10007';
      const hasUnderscores = href.includes('_') ? '&#10007' : '&#10003';
      const hasDuplicateSlashes = /\/{2,}/.test(href.replace(/^https?:\/\//, '')) ? '&#10007' : '&#10003';

      return {
        link: href,
        isLowerCase,
        hasUnderscores,
        hasDuplicateSlashes,
        isValid: isLowerCase === '&#10003' && hasUnderscores === '&#10003' && hasDuplicateSlashes === '&#10003',
      };
    });

  return anchorData;
}

  
  
export const checkSocialNetworks = (sourceCode) => {
  const socialLinks = [...sourceCode.matchAll(/<a\s+href="(https?:\/\/(www\.)?(facebook.com|twitter.com|instagram.com|linkedin.com|pinterest.com)\.com\/[^"]+)"[^>]*>(.*?)<\/a>/gi)];
  
      // Process each social link found
      const socialData = socialLinks.map((match, index) => {
          const href = match[1]; // Full URL of the link
          const platform = match[3]; // Social platform (facebook, twitter, etc.)
          
          
          return {
              sNo: index + 1,
              link: href,
              platform,
          };
      });
  
      return socialData
  }

    export const checkCustom404 = (sourceCode, url, robots, sitemap, page404, customIndicators = [
      'oops',               // Common text used in custom 404 pages
      'page not found',     // Another common text
      'we couldn\'t find',  // Some sites use this kind of wording for 404
      '404 error',          // Direct match for common 404 error pages
      'back to homepage',   // Link or text directing back to the homepage
      'sorry',              // Some custom pages start with 'Sorry'
      'lost in space',      // Some playful custom 404 pages
      'something went wrong', // Often used in custom error pages
      'we\'re sorry',       // Another common 404 message
      'oops! page not found', // Some custom 404 pages might include this phrase
      'this page is lost',  // Another possible custom 404 text
      'we can\'t find the page', // Another wording for 404
      'unable to locate',   // Used in some custom 404 pages
      'broken link',        // Sometimes used in 404 page messages
      'we could not locate' // Alternative wording for 404 page
    ]) => {
      // Check if the 404 page contains any of the custom indicators (case-insensitive)
      const isCustom404 = customIndicators.some(indicator => 
        page404.toLowerCase().includes(indicator.toLowerCase())
      );
    
      // If the page is identified as a 404, check other parameters for further analysis
      const checkAdditionalConditions = () => {
        // Check source code for a "404" or "not found" message (could be an HTML element or text)
        const is404InSourceCode = sourceCode && /404|not found/i.test(sourceCode);
    
        // Check robots.txt for any disallowed pages
        const isRobotsBlocked = robots && /disallow/i.test(robots);
    
        // Check sitemap to see if the page is listed (for instance, 'not listed' in sitemap could indicate it is a 404)
        const isInSitemap = sitemap && sitemap.includes(url);
    
        // Return a detailed object with additional info
        return {
          is404InSourceCode,
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
    
  

  export const checkDomains = (sourceCode, url) => {
    try {
      // Extract domain using URL API
      const domain = new URL(url).hostname;
      
      // Remove 'www.' and common TLDs like '.com' from the domain
      let cleanedDomain = domain.replace(/^www\./, ''); // Remove 'www.' if present
      cleanedDomain = cleanedDomain.replace(/\.com$/, ''); // Remove '.com' if present (can add more TLDs here)
  
      // Calculate the cleaned domain length
      const domainLength = cleanedDomain.length;
  
      // Check for special characters
      const hasSpecialCharacters = /[!@#$%^&*(),?":{}|<>]/.test(cleanedDomain);
  
      // Check for subdomains (if there are multiple dots in the cleaned domain name)
      const hasSubdomains = cleanedDomain.split('.').length > 1;
  
      // Evaluate each SEO criterion
      const seoFriendlyLength = domainLength >= 5 && domainLength <= 63;
      const seoFriendlySpecialCharacters = !hasSpecialCharacters;
      const seoFriendlySubdomains = !hasSubdomains;
  
      // Generate detailed reasons for SEO friendliness or issues
      const reasons = [];
  
      if (seoFriendlyLength) {
        reasons.push("The domain length is within the SEO-friendly range (5-63 characters).");
      } else {
        reasons.push(`The domain length (${domainLength} characters) is not within the SEO-friendly range.`);
      }
  
      if (seoFriendlySpecialCharacters) {
        reasons.push("The domain does not contain any special characters, which is good for SEO.");
      } else {
        reasons.push("The domain contains special characters, which can negatively impact SEO.");
      }
  
      if (seoFriendlySubdomains) {
        reasons.push("The domain does not have excessive subdomains, making it more SEO-friendly.");
      } else {
        reasons.push("The domain contains subdomains, which can negatively impact SEO.");
      }
  
      // Overall SEO status
      const isSeoFriendly =
        seoFriendlyLength && seoFriendlySpecialCharacters && seoFriendlySubdomains;
  
      return {
        domain: cleanedDomain + '.com',
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
      return {
        status: `Failed  ${error}`,
        message: `Invalid URL. Please provide a valid URL-> "${url}"`,
        report: 'The URL provided could not be processed. Ensure it is a valid URL format.',
      };
    }
  };
  
  
  
  
  export const checkHeadingTags = (sourceCode) => {
    // Function to decode HTML entities
    const decodeHtmlEntities = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    // Function to remove all HTML tags except the text content
    const removeHtmlTags = (html) => {
        return html.replace(/<[^>]+>/g, '').trim();
    };

    // Match all occurrences of h1 to h6 tags, accounting for line breaks and whitespace
    const h1Matches = [...sourceCode.matchAll(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/gi)];
    const h2Matches = [...sourceCode.matchAll(/<h2[^>]*>\s*([\s\S]*?)\s*<\/h2>/gi)];
    const h3Matches = [...sourceCode.matchAll(/<h3[^>]*>\s*([\s\S]*?)\s*<\/h3>/gi)];
    const h4Matches = [...sourceCode.matchAll(/<h4[^>]*>\s*([\s\S]*?)\s*<\/h4>/gi)];
    const h5Matches = [...sourceCode.matchAll(/<h5[^>]*>\s*([\s\S]*?)\s*<\/h5>/gi)];
    const h6Matches = [...sourceCode.matchAll(/<h6[^>]*>\s*([\s\S]*?)\s*<\/h6>/gi)];

    // Extract the text content for each match, clean up HTML entities, and remove inner HTML tags
    const h1Headings = h1Matches.map(match => decodeHtmlEntities(removeHtmlTags(match[1])));
    const h2Headings = h2Matches.map(match => decodeHtmlEntities(removeHtmlTags(match[1])));
    const h3Headings = h3Matches.map(match => decodeHtmlEntities(removeHtmlTags(match[1])));
    const h4Headings = h4Matches.map(match => decodeHtmlEntities(removeHtmlTags(match[1])));
    const h5Headings = h5Matches.map(match => decodeHtmlEntities(removeHtmlTags(match[1])));
    const h6Headings = h6Matches.map(match => decodeHtmlEntities(removeHtmlTags(match[1])));

    return {
        h1: h1Headings.length > 0 ? h1Headings : 'Not Found',
        h2: h2Headings.length > 0 ? h2Headings : 'Not Found',
        h3: h3Headings.length > 0 ? h3Headings : 'Not Found',
        h4: h4Headings.length > 0 ? h4Headings : 'Not Found',
        h5: h5Headings.length > 0 ? h5Headings : 'Not Found',
        h6: h6Headings.length > 0 ? h6Headings : 'Not Found',
    };
};


  
  
  
  export const checkSecurity = (sourceCode) => {
    // Updated regex to match the entire <a> tag with target="_blank"
    const linksWithBlankTarget = [...sourceCode.matchAll(/<a[^>]+target="_blank"[^>]*>.*?<\/a>/gi)];
  
    // Extracting the whole <a> element
    const links = linksWithBlankTarget.map(match => match[0]);
  
    // Checking if any links were found with target="_blank"
    return links 
    
  };
  
  

  