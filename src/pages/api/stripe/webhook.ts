import { prisma } from "./../../../server/db";
import type { Stripe } from "stripe";
import getRawBody from "raw-body";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { stripe } from "~/server/api/stripe";
import { api } from "~/utils/api";
import {
  lodgifyHeaders,
  propertiesRouter,
} from "~/server/api/routers/properties";

const STRIPE_SIGNATURE_HEADER = "stripe-signature";

// NB: we disable body parser to receive the raw body string. The raw body
// is fundamental to verify that the request is genuine
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function checkoutsWebhooksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.headers[STRIPE_SIGNATURE_HEADER];
  const rawBody = await getRawBody(req);

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.WEBHOOK_SECRET_KEY
  );

  const caller = propertiesRouter.createCaller({ prisma });

  // NB: if stripe.webhooks.constructEvent fails, it would throw an error

  // here we handle each event based on {event.type}

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const { created, data } = event;

        const {
          receipt_email: email,
          shipping: { name, phone },
          metadata: {
            pricing,
            pricePerNight,
            propertyName,
            totalPrice,
            arrival,
            departure,
            lodgifyPropertyId,
            lodgifyRoomId,
          },
        } = data.object;

        const priceDetails = JSON.parse(pricing);
        const amountDetails: { [key: string]: number } = {};
        priceDetails.forEach(
          (item: { [key: string]: number }, index: number) => {
            const key: string = Object.keys(item)[0];
            const value: number = item[key];
            amountDetails[key] = value;
          }
        );

        console.log(
          lodgifyPropertyId,
          lodgifyRoomId,
          name,
          arrival,
          departure,
          totalPrice
        );

        const bookingId = await caller.createBooking({
          propertyId: lodgifyPropertyId,
          roomId: lodgifyRoomId,
          guestName: name,
          arrival: arrival,
          departure: departure,
          totalPrice: totalPrice,
        });

        if (typeof bookingId !== "number") {
          // TODO: Send some alert (email, text) to the team to resolve this. Customer has paid but Lodgify was unable to create the booking.
          return res.status(400).json({
            message:
              "Customer has paid but Lodgify was unable to create the booking.",
            lodgifyError: bookingId,
            customer: { name, email, phone },
            propertyName,
            dates: { arrival, departure },
            totalPrice,
          });
        }

        const bookingResponse = await fetch(
          // Gets a quote - https://docs.lodgify.com/reference/get_v2-quote-propertyid
          `https://api.lodgify.com/v2/reservations/bookings/${bookingId}`,
          {
            method: "GET",
            headers: lodgifyHeaders,
          }
        ).then((response) => response.json());

        if (bookingResponse.status !== "Booked") {
          // TODO: Send some alert (email, text) to the team to resolve this. Customer has paid but Lodgify was unable to create the booking.
          return res.status(403).json({
            message:
              "Customer has already paid but the booking dates conflict with another booking, therefore it was not created.",
            lodgifyBookingId: bookingId,
            lodgifyBookingStatus: bookingResponse.status,
            customer: { name, email, phone },
            propertyName,
            dates: { arrival, departure },
            totalPrice,
          });
        }

        //TODO: Send guest a confirmation email
        return res.status(200).json({
          customer: { name, email, phone },
          propertyName,
          dates: { arrival, departure },
          totalPrice,
          pricePerNight,
          amountDetails,
          bookingId: bookingId,
          created,
        });
      }
    }

    return res
      .status(200)
      .json({ responseMessage: "not payment_intent.succeeded" });
  } catch (e) {
    return res.status(500).json({ responseMessage: "Server Error" });
  }
}
