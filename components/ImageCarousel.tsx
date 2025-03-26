import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";

interface Props {
  images: {
    id: string;
    path: string;
    createdAt: Date;
    productId: string;
    alt: string;
    isPrimary: boolean;
  }[];
  className?: string;
}

const ImageCarousel = ({ images, className }: Props) => {
  return (
    <div>
      <Carousel
        opts={{
          align: "center",
        }}
        className={`${className} w-full`}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem id={image.id}>
              <Image
                id={image.id}
                src={image.path}
                alt={image.alt}
                width={400}
                height={400}
                className="justify-self-center my-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
