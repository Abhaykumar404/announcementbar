import { json } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import { activateAppId } from "app/utils/constants";

export const loader = async ({ request }: { request: Request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);

    if (!session || !session.accessToken) {
      console.log("Invalid session: ", session);
      throw new Error("Unauthorized: Missing or invalid session");
    } else {
      console.log("Valid session: ", session);
    }

    // Get all themes
    const allThemes = await admin.rest.resources.Theme.all({ session });
    console.log("allThemes", allThemes);

    // Filter the main theme
    const liveTheme = allThemes.data.filter((e: any) => e.role === "main");
    // Get the first theme from the filtered list
    const firstLiveTheme = liveTheme[0];

    // Get the settings_data.json asset
    const settingsAsset = await admin.rest.resources.Asset.all({
      session: session,
      theme_id: firstLiveTheme.id,
      asset: { key: "config/settings_data.json" },
    });

    // parse the asset value
    const assetValue = JSON.parse(`${settingsAsset.data[0].value}`);

    const blocks = assetValue?.current?.blocks ?? {};

    // Find the embed block
    const embedBlock: any = Object.entries(blocks).find(
      ([id, info]: [id: any, info: any]) => {
        return info?.type?.endsWith(activateAppId) && !info.disabled;
      }
    );

    console.log("embedBlock", embedBlock);

    // If the embed block is found and not disabled, return true
    if (embedBlock && embedBlock[1].disabled === false) {
      return json({ isAppActive: true });
    }

    return json({ isAppActive: false });
  } catch (error: any) {
    console.log("JAYANT ERROR ==== ", error);

    throw new Error(error);
  }
};
