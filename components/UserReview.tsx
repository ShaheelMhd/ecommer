"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";
import DeleteReviewButton from "./DeleteReviewButton";
import StarRating from "./StarRating";
import { Separator } from "./ui/separator";

type UserReview = {
  name: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

interface Props {
  productId: string;
}

const UserReview = ({ productId }: Props) => {
  const [userReview, setUserReview] = useState<UserReview | null>(null);

  const handleOnReview = (data: UserReview) => {
    setUserReview(data);
  };

  return (
    <>
      {userReview ? (
        <>
          <div>
            <span className="flex justify-between">
              <h2>You</h2>
              <DeleteReviewButton productId={productId} />
            </span>
            <span className="flex gap-2 items-center mb-2">
              <StarRating rating={userReview.rating} />
              <p>{`(${userReview.rating}/5)`}</p>
            </span>
            <p className="text-lg mb-1">{userReview.comment}</p>
            <p className="opacity-80 text-sm">
              Added on{" "}
              {new Date(userReview.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
          <Separator className="my-5 opacity-65 w-[80%] justify-self-center" />
        </>
      ) : (
        <ReviewForm productId={productId} onReview={handleOnReview} />
      )}
    </>
  );
};

export default UserReview;
