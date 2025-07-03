export function getStrapiURL(path = "") {
    return (
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:3090"}${path}`
    );
}

export function getStrapiMedia(url: string | undefined) {
    if (!url) {
        return null;
    }
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }
    return getStrapiURL(url);
}
