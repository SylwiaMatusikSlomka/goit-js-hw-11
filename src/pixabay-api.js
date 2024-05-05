import axios from "axios";

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '43705788-b7907f95512015132904a0a25';

export function downloadContents(serchText, page, imagesPerPage) {
    return new Promise((resolve, reject) => {
        axios.get(API_URL, {
            params: {
              key: API_KEY,
              q: serchText,
              image_type: 'photo',
              orintation: 'horizontal',
              safesearch: true,
              page: page,
              per_page: imagesPerPage,
            }})
            .then(res => {
                resolve({ data: res, error: null });
            })
            .catch(error => {
                reject({ data: null, error: error });
            });
    });
}