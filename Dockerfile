# Dev-friendly image — fast build so Docker starts quickly
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Browser hits host-mapped API
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_CATEGORY_IMAGE=http://localhost:5000/category/
ENV NEXT_PUBLIC_BRAND_IMAGE=http://localhost:5000/brand/
ENV NEXT_PUBLIC_PRODUCT_IMAGE=http://localhost:5000/product/
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Soza0V3vzynWsi

EXPOSE 3000

CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
