import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1/' 
});

export const fetchCategories = () => api.get('categories.php');
export const fetchByCategory = (category) => api.get(`filter.php?c=${category}`);
export const searchByName = (name) => api.get(`search.php?s=${name}`);
export const fetchById = (id) => api.get(`lookup.php?i=${id}`);