import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  console.log("🚀 Webhook called");

  const body = await req.text();
  console.log("📥 Raw body received");

  const paystackSignature = headers().get("x-paystack-signature");
  console.log("🔑 Paystack Signature:", paystackSignature);

  if (!paystackSignature) {
    console.error("❌ Unauthorized: Missing Signature");
    return new NextResponse("Unauthorized: Missing Signature", { status: 401 });
  }

  // Verify the Paystack webhook signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  console.log("🔍 Computed Hash:", hash);
  console.log("🔍 Paystack Sent Hash:", paystackSignature);

  if (hash !== paystackSignature) {
    console.error("❌ Unauthorized: Invalid Signature");
    return new NextResponse("Unauthorized: Invalid Signature", { status: 401 });
  }

  console.log("✅ Signature verification passed");

  // Parse the event body
  const event = JSON.parse(body);
  console.log("📩 Received Paystack event:", event);

  if (event.event === "charge.success") {
    console.log("💰 Processing successful payment");

    const { metadata, reference, amount } = event.data;

    if (!metadata?.userId || !metadata?.courseId) {
      console.error("❌ Webhook Error: Missing metadata", metadata);
      return new NextResponse("Webhook Error: Missing metadata", {
        status: 400,
      });
    }

    console.log("📊 Extracted metadata:", metadata);

    // Check if purchase already exists
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: metadata.userId,
          courseId: metadata.courseId,
        },
      },
    });

    console.log("🧐 Existing purchase check:", existingPurchase);

    if (existingPurchase) {
      console.log("🔁 Purchase already exists for user:", metadata.userId);
      return new NextResponse("Purchase already exists", { status: 200 });
    }

    // Store the purchase in the database
    console.log(
      "📝 Creating new purchase for user:",
      metadata.userId,
      "and course:",
      metadata.courseId
    );

    await db.purchase.create({
      data: {
        courseId: metadata.courseId,
        userId: metadata.userId,
        paystackReference: reference,
        amount: amount / 100, // Convert kobo to the actual amount
        status: "completed",
      },
    });

    console.log("✅ Purchase successfully created");

    // Construct the redirect URL for the course page
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${metadata.courseId}`;
    console.log(`➡️ Redirecting user to: ${redirectUrl}`);

    // Return the redirect URL in the response
    return NextResponse.json({ redirectUrl });
  }

  console.log(`⚠️ Unhandled event type: ${event.event}`);
  return new NextResponse(`Unhandled event type: ${event.event}`, {
    status: 200,
  });
}
