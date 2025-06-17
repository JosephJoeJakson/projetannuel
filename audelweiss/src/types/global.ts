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
            alternativeText?: string | null;
        };
        link?: {
            name: string;
            url: string;
            isOnline?: boolean;
            isExternal?: boolean;
        }[];
    };
}
