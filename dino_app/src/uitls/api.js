import axios from 'axios';
import urlInfor from './baseUrl';

class API {
    constructor() {
        this.axios = axios.create({
            baseURL: `${urlInfor.basedUrl}`,
            timeout: 100000,
        });
    }

    static setHeader(token) {
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    // ================================TimeSheetPage - TimeSheetActivity=============================

    //#region  /api/Product
    async getByIdProduct(id) {
        return await this.axios.post(`/api/Product/GetById?id=${id}`);
    }
    async getAllProduct() {
        return await this.axios.get('/api/Product/GetAll');
    }
    //#endregion 

    //#region  Category
    async getByIdCategory(id) {
        return await this.axios.get('/api/Category/GetById', id);
    }
    async getAllCategory() {
        return await this.axios.get('/api/Category/GetAll');
    }

    //#endregion 
    //#region  customer
    async addCustomer(data) {
        return await this.axios.post(`/api/Customer/Create`, data);
    }

    async editCustomer(data) {
        return await this.axios.put('/api/Customer/Edit', data);
    }



}

export default new API()