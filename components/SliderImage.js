/* eslint-disable import/no-anonymous-default-export */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import 'swiper/css/autoplay';

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function imgUrl() {
  const id = rand(1, 200);
  return `https://picsum.photos/id/${id}/1920/1080`;
}

function createSlide() {
  return (
    <SwiperSlide>
      <img className="w-full" src={imgUrl()} alt="" />
    </SwiperSlide>
  );
}


export default function SliderImage() {
  return (
    <Swiper

    // install Swiper modules
    modules={[Navigation, Pagination, Autoplay]}
    slidesPerView={2}
    navigation
    autoplay={{ delay: 2000 }}
    pagination={{ clickable: true }}
  >

    <SwiperSlide>
    <img className="w-full" src="https://i.ibb.co/YyzNTbK/image2.png" alt="" />
    </SwiperSlide>
    <SwiperSlide>
    <img className="w-full" src="https://i.ibb.co/zJjL6X6/image1.jpg" alt="" />
    </SwiperSlide>
    <SwiperSlide>
    <img className="w-full" src="https://i.ibb.co/sRJYLG9/image5.png" alt="" />
    </SwiperSlide>
    <SwiperSlide>
    <img className="w-full" src="https://i.ibb.co/GsKnpNf/image3.png" alt="" />
    </SwiperSlide>
  </Swiper>
  )
}
