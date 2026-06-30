import { client } from "@/utils/helper"
import { cookies } from "next/headers"

const getCategories = async (query = {}) => {
    try {
        const filter = new URLSearchParams()

        if (query.status) filter.append("status", query.status)
        if (query.is_home) filter.append("is_home", query.is_home)
        if (query.limit) filter.append("limit", query.limit)
        if (query.id) filter.append("id", query.id)

        const response = await client.get(`/category?${filter.toString()}`)

        if (!response.data.success) {
            throw new Error(response.data.message || "Fail API")
        }
        return response.data

    } catch (error) {
        console.log("API ERROR ", error?.response?.data || error.message)
        throw error
    }
}

const getCategoriesById = async (id) => {
    const response = await client.get(`/category/${id}`)
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }
    return response.data
}

const getBrands = async (query = {}) => {
    const filter = new URLSearchParams()
    if (query.status) filter.append("status", query.status)
    if (query.is_popular) filter.append("is_popular", query.is_popular)
    if (query.limit) filter.append("limit", query.limit)
    if (query.id) filter.append("id", query.id)

    const response = await client.get(`/brand?${filter.toString()}`)
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }
    return response.data
}

const getBrandById = async (id) => {
    const response = await client.get(`/brand/${id}`)
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }
    return response.data
}

const getColors = async (query = {}) => {

    const filter = new URLSearchParams();
    if (query.status) filter.append("status", query.status)
    if (query.limit) filter.append("limit", query.limit)
    if (query.id) filter.append("id", query.id)
    const response = await client.get(`/color?${filter.toString()}`)
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }
    return response.data
}

const getColorsById = async (id) => {
    const response = await client.get(`/color/${id}`)
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }
    return response.data
}

const getProducts = async (query = {}) => {

    const filter = new URLSearchParams();
    if (query.status) filter.append("status", query.status)
    if (query.limit) filter.append("limit", query.limit)
    if (query.id) filter.append("id", query.id)
    if (query.category_slug) filter.append("category_slug", query.category_slug)
    if (query.brand_slug) filter.append("brand_slug", query.brand_slug)
    // console.log(query.brand_slug)
    if (query.color_slug) filter.append("color_slug", query.color_slug)
    if (query.min_price) filter.append("min_price", query.min_price)
    if (query.max_price) filter.append("max_price", query.max_price)
    if (query.sort) filter.append("sort", query.sort)

    const response = await client.get(`/product?${filter.toString()}`)
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }
    return response.data
}

const getProductById = async (id) => {
    // console.log(id)
    // return
    const response = await client.get(`/product/${id}`)
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }
    return response.data
}

const getMe = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value ?? null;

    if (!token) {
        return { user: null }
    }
    const response = await client.get("/user/get", {
        headers: {
            Authorization: token
        }
    })
    if (!response.data.success) {
        throw new Error(response.data.message || "Fail API")
    }

    return response.data



}


export { getCategories, getCategoriesById, getBrands, getBrandById, getColors, getColorsById, getProducts, getProductById, getMe }