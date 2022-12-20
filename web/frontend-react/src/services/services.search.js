import Instance from '../helper/Instance';
import { URI } from '../helper/BaseURI';

export async function Search(keyword) {
    try {
        const response = await Instance.get(`${URI}/searchapp/api/search/?q=${keyword}`)
        return response;
    } catch (error) {
        console.error(error);
    }
}

export async function EntityData(name) {
    try {
        const response = await Instance.get(`${URI}/searchapp/api/entity/?name=${name}&page_size=100&page=1`)
        return response;
    } catch (error) {
        console.error(error);
    }
}

export async function EntityDetail(id) {
    try {
        const response = await Instance.post(`${URI}/searchapp/api/entity/getDetail/`, id)
        return response;
    }
    catch (error) {
        console.log(error)
    }
}

export async function Relation(ids) {
    try {
        const response = await Instance.post(`${URI}/searchapp/api/entity/relation/`, ids)
        return response;
    } catch (error) {
        console.error(error);
    }
}