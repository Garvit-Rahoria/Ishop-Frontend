'use server'

import { client } from "@/utils/helper"
import { cookies } from "next/headers"

const SAFE_EMPTY = { success: false, data: [], meta: {} };

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
        console.warn("getCategories failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getCategoriesById = async (id) => {
    try {
        const response = await client.get(`/category/${id}`)
        if (!response.data.success) {
            throw new Error(response.data.message || "Fail API")
        }
        return response.data
    } catch (error) {
        console.warn("getCategoriesById failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getBrands = async (query = {}) => {
    try {
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
    } catch (error) {
        console.warn("getBrands failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getBrandById = async (id) => {
    try {
        const response = await client.get(`/brand/${id}`)
        if (!response.data.success) {
            throw new Error(response.data.message || "Fail API")
        }
        return response.data
    } catch (error) {
        console.warn("getBrandById failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getColors = async (query = {}) => {
    try {
        const filter = new URLSearchParams();
        if (query.status) filter.append("status", query.status)
        if (query.limit) filter.append("limit", query.limit)
        if (query.id) filter.append("id", query.id)

        const response = await client.get(`/color?${filter.toString()}`)
        if (!response.data.success) {
            throw new Error(response.data.message || "Fail API")
        }
        return response.data
    } catch (error) {
        console.warn("getColors failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getColorsById = async (id) => {
    try {
        const response = await client.get(`/color/${id}`)
        if (!response.data.success) {
            throw new Error(response.data.message || "Fail API")
        }
        return response.data
    } catch (error) {
        console.warn("getColorsById failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getProducts = async (query = {}) => {
    try {
        const filter = new URLSearchParams();
        if (query.status) filter.append("status", query.status)
        if (query.limit) filter.append("limit", query.limit)
        if (query.id) filter.append("id", query.id)
        if (query.category_slug) filter.append("category_slug", query.category_slug)
        if (query.brand_slug) filter.append("brand_slug", query.brand_slug)
        if (query.color_slug) filter.append("color_slug", query.color_slug)
        if (query.min_price) filter.append("min_price", query.min_price)
        if (query.max_price) filter.append("max_price", query.max_price)
        if (query.sort) filter.append("sort", query.sort)

        const response = await client.get(`/product?${filter.toString()}`)
        if (!response.data.success) {
            throw new Error(response.data.message || "Fail API")
        }
        return response.data
    } catch (error) {
        console.warn("getProducts failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getProductById = async (id) => {
    try {
        const response = await client.get(`/product/${id}`)
        if (!response.data.success) {
            throw new Error(response.data.message || "Fail API")
        }
        return response.data
    } catch (error) {
        console.warn("getProductById failed:", error?.response?.data || error.message)
        return SAFE_EMPTY
    }
}

const getMe = async () => {
    try {
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
            return { user: null }
        }

        return response.data
    } catch (error) {
        console.warn("getMe failed:", error?.response?.data || error.message)
        return { user: null }
    }
}


export {
    getCategories,
    getCategoriesById,
    getBrands,
    getBrandById,
    getColors,
    getColorsById,
    getProducts,
    getProductById,
    getMe
}
