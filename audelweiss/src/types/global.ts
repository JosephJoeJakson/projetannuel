export interface NavbarLink {
    name: string;
    url: string;
    isOnline?: boolean;
    isExternal?: boolean;
}

export interface GlobalData {
    title: string;
    metadescription?: string;
    navigation?: {
        logo?: {
            url: string;
            alternativeText?: string;
        };
        link?: {
            name: string;
            url: string;
            isOnline?: boolean;
            isExternal?: boolean;
        }[];
        megaMenu?: {
            title: string;
            categories?: {
                name: string;
                url: string;
                isOnline?: boolean;
                isExternal?: boolean;
            }[];
            trends?: {
                name: string;
                url: string;
                isOnline?: boolean;
                isExternal?: boolean;
            }[];
        };
    };
}
