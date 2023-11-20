import React, { useState, useEffect } from "react";
import axios from "axios";
import Center from "./Center";
import styled from "styled-components";
import Link from "next/link";

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: normal;
`;

const Image = styled.img`
  margin: 0 auto;
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 10px;
  @media (max-width: 768px) {
    height: 50px;
    width: 50px;
  }
`;

export default function CategoriesPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/images");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <Center>
        <Title>Categories</Title>
        <div className="">
          <ul className="flex">
            {images.map((image, i) => (
              // eslint-disable-next-line react/jsx-key
              <Link href={"/category/" + image._id}>
                <li className=" m-2 p-2 border hover:border-1 hover:border-blue-500 bg-white rounded-xl  flex flex-col items-center justify-center text-center duration-300 hover:bg-white shadow-sm hover:shadow-2xl">
                  <Image src={image.images} alt="" />
                  <span class="font-semibold my-3 text-gray-600 ">
                    {image.name}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </Center>
    </div>
  );
}
