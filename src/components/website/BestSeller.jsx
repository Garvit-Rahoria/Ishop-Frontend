"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import ProductCard from "./Productcard";

export default function BestSeller() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="font-bold my-5 text-xl">BEST SELLER</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        <SwiperSlide>
          <ProductCard />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard />
        </SwiperSlide>

        <SwiperSlide>
          <ProductCard />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}