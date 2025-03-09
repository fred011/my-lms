"use client";

import { Button } from "@/components/ui/button";
import { FormatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      // Step 1: Call your backend to create a Paystack checkout URL
      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      // Step 2: Redirect the user to Paystack's payment page
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error during checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size={"sm"}
      className="w-full md:w-auto"
    >
      Enroll for {FormatPrice(price)}
    </Button>
  );
};
