import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      shopLocales {
        locale
        primary
        published
        name
      }
    }`
  );

  const responseData = await response.json();

  const listOfShopLocales = responseData?.data?.shopLocales;

  return json({ listOfShopLocales });
};
