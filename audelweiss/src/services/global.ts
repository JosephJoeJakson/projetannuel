import {getRequest} from "../../lib/strapi";
import { GlobalData } from '@/types/global';
export async function fetchGlobal(): Promise<GlobalData | null> {
    const data = await getRequest(
        'global?populate[navigation][populate][logo]=true' +
        '&populate[navigation][populate][link]=true' +
        '&populate[navigation][populate][megaMenu][populate][categories]=true' +
        '&populate[navigation][populate][megaMenu][populate][trends]=true'
    );
    return data?.data || null;
}

export async function fetchFooterMenu() {
    const data = await getRequest(
        'global?populate[footerMenu][populate][link]=true'
    );
    return data?.data?.footerMenu?.link || [];
}

export async function fetchFooterHelpMenu() {
    const data = await getRequest(
        'global?populate[footerHelpMenu][populate][link]=true'
    );
    return data?.data?.footerHelpMenu?.link || [];
}

export async function fetchGlobalFull() {
    const data = await getRequest(
        'global?populate[navigation][populate][logo]=true' +
        '&populate[navigation][populate][link]=true' +
        '&populate[navigation][populate][megaMenu][populate][categories]=true' +
        '&populate[navigation][populate][megaMenu][populate][trends]=true' +
        '&populate[footerMenu][populate][link]=true' +
        '&populate[footerHelpMenu][populate][link]=true' +
        '&populate[socialLinks]=true'
    );
    return data?.data || null;
}