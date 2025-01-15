import {
  Page,
  Grid,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Card,
} from "@shopify/polaris";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import shopify from "app/shopify.server";

export default function ChooseAnnoncementType() {
  useEffect(() => {
    shopify.loading(false);
  }, []);

  const navigate = useNavigate();

  const listOfAnnouncementTypes = [
    {
      image:
        "https://storage.googleapis.com/ia-countdown-timer/Announcement%20Bar.svg",
      title: "Top/Bottom Bar",
      subtitle: "Fixed or sticky bar on the top or bottom of any page.",
      onClick: () => {
        navigate("/app/announcement/new?announcementType=top-bottom-bar");
      },
    },
    // {
    //   image:
    //     "https://storage.googleapis.com/ia-countdown-timer/Cart%20Page.svg",
    //   title: "Cart Page",
    //   subtitle: "Add an announcement bar to the top of the cart page.",
    //   disabled: true,
    //   buttonText: "Coming Soon",
    //   onClick: () => {
    //     navigate("/app/announcement/new?announcementType=cart-page");
    //   },
    // },
    {
      image:
        "https://cdn.shopify.com/app-store/listing_images/f4465913b474824b9a8b21469ed5aeb6/promotional_image/CKaI2YXfwIkDEAE=.png?height=720&width=1280",
      title: "IA ‑ Cart Drawer Cart Upsell",
      subtitle:
        "Boost AOV & CR with slide cart drawer, cart upsell & cross sell and more.",
      onClick: () => {
        window.open(
          "https://apps.shopify.com/ia-cart-drawer-free-gifts",
          "_blank"
        );
      },
      buttonText: "View App",
    },
  ];

  return (
    <Page
      title="Choose announcement type"
      backAction={{
        content: "Back",
        onAction: () => {
          navigate("/app");
        },
      }}
    >
      <Grid>
        {listOfAnnouncementTypes.map((announcementDetails, index) => (
          <Grid.Cell
            key={index}
            columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
          >
            <div className="timer-selector-card">
              <Card>
                <img
                  alt="Product page"
                  width="100%"
                  height="200px"
                  src={announcementDetails.image}
                />
                <BlockStack gap={"050"}>
                  <div />
                  <div />
                  <div />
                  <InlineStack gap={"200"}>
                    <Text variant="headingSm" as="h6">
                      {announcementDetails.title}
                    </Text>
                  </InlineStack>
                  <Text variant="bodyMd" as="p" tone="subdued">
                    {announcementDetails.subtitle}
                  </Text>
                  <div />
                  <div />
                  <div />
                  <Button
                    fullWidth
                    // disabled={announcementDetails.disabled}
                    onClick={() => {
                      announcementDetails.onClick();
                    }}
                  >
                    {announcementDetails.buttonText || "Select this timer type"}
                  </Button>
                </BlockStack>
              </Card>
            </div>
          </Grid.Cell>
        ))}
      </Grid>

      <div style={{ height: 50 }} />
    </Page>
  );
}
