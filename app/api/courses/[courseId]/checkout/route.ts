import { db } from "@/lib/db";
import { paystack } from "@/lib/paystack";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  console.log("🚀 Checkout API called");

  try {
    // Step 1: Get the current user
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      console.error("❌ Unauthorized user");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(`✅ User found: ${user.id}`);

    // Step 2: Find the course by courseId
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      console.error("❌ Course not found");
      return new NextResponse("Course Not Found", { status: 404 });
    }

    console.log(`📚 Course found: ${course.title}`);

    // Step 3: Check if the user already purchased the course
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      console.warn("⚠️ User already purchased this course");
      return new NextResponse("Already purchased", { status: 400 });
    }

    // Step 4: Create or fetch Paystack Customer ID
    let paystackCustomer = await db.paystackCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        paystackCustomerId: true,
      },
    });

    if (!paystackCustomer) {
      console.log("👤 Creating new Paystack customer...");
      const customerResponse = await paystack.post("/customer", {
        email: user.emailAddresses[0].emailAddress,
      });

      paystackCustomer = await db.paystackCustomer.create({
        data: {
          userId: user.id,
          paystackCustomerId: String(customerResponse.data.data.id),
        },
      });

      console.log(
        `✅ Paystack customer created: ${paystackCustomer.paystackCustomerId}`
      );
    } else {
      console.log(
        `✅ Existing Paystack customer: ${paystackCustomer.paystackCustomerId}`
      );
    }

    // Step 5: Create Paystack Checkout Session
    console.log("💰 Creating Paystack transaction...");
    const sessionResponse = await paystack.post("/transaction/initialize", {
      email: user.emailAddresses[0].emailAddress,
      amount: Math.round(course.price! * 100), // Convert price to kobo
      currency: "ZAR",
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack-webhook?reference={reference}`, // Use your webhook URL for success
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
    });

    const { authorization_url } = sessionResponse.data.data;
    console.log(`🔗 Paystack Checkout URL: ${authorization_url}`);

    return NextResponse.json({ url: authorization_url });
  } catch (error) {
    console.error("🔥 Error in Checkout:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
