"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  productId: string;
}

const ReviewForm = ({ productId }: Props) => {
  const commentSchema = z.object({
    comment: z
      .string()
      .min(3, "At least 3 characters required.")
      .max(500, "Maximum 500 characters allowed.")
      .optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(commentSchema),
  });

  const [rating, setRating] = useState(0);

  // to determine if the "Add a review" button should be visible
  const [buttonVisible, setButtonVisibile] = useState(true);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          rating: rating,
          comment: data.comment,
        }),
      });

      if (!response.ok) throw new Error(response.status.toString());
      toast.success("Review added!")
    } catch (error) {
      console.error("Error adding a review.", error);
      toast.error("Failed to add review.");
    }
  };

  return (
    <>
      {buttonVisible && (
        <Button
          className="mb-5 py-6 text-md"
          onClick={() => setButtonVisibile(false)}
        >
          <FaPlus />
          Add a review
        </Button>
      )}
      {!buttonVisible && (
        <>
          {/* TODO: add dynamic page change on adding or removing review */}
          <p className="mb-1">Rating:</p>
          <StarRating selector onChange={handleRatingChange} />
          <form onSubmit={handleSubmit(onSubmit)} className="my-3">
            <p>{`Comment (optional):`}</p>
            <span className="flex mt-1 gap-2">
              <Input
                {...register("comment")}
                id="comment"
                className="dark mb-2"
                placeholder="Type your comment..."
              />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </span>
            {errors.comment && (
              <p className="text-destructive">{`${errors.comment.message}`}</p>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default ReviewForm;
