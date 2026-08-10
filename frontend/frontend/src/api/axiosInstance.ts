import axios from "axios";

//pravimo ovu instancu da ne bismo u svakom pozivu pisali cijeli url, vec cemo samo /auth/login, a axios ce sam dodavati baseURL ispred
//5000 je zato sto je backend na portu 5000
//withCredentials znaci da iako je be na 5000 a fe na 5173, axios kaze, ipak salji cookies sa ovim zahtjevima

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export default axiosInstance;