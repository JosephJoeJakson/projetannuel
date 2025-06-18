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