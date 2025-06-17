import {getRequest} from "../../lib/strapi";
import { GlobalData } from '@/types/global';
export async function fetchGlobal() {
    const data = await getRequest(
        'global?populate[navigation][populate][logo]=true&populate[navigation][populate][link]=true'
    );
    return data?.data || null;
}