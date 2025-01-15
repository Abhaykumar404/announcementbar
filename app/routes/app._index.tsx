import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
  IndexTable,
  Badge,
  MediaCard,
  EmptyState,
  SkeletonBodyText,
} from "@shopify/polaris";
// import { useAppBridge } from "@shopify/app-bridge-react";
import shopify, { authenticate } from "../shopify.server";
import { SetupGuide } from "../common-components/setup-guide";
import { activateAppId, BACKEND_URL } from "../utils/constants";
import { type Announcement } from "@prisma/client";
import { HomePageStorageUtils } from "../utils/local-storage-utils/home-page-storage-utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  console.log("session", session);

  return null;
};

export default function Index() {
  // const shopify = useAppBridge();
  const navigate = useNavigate();

  const [doNotShowReviewBanner, setDoNotShowReviewBanner] = useState(true);
  const [doNotShowSetupGuide, setDoNotShowSetupGuide] = useState(true);

  const [
    doNotShowAppRecommendationBanner,
    setDoNotShowAppRecommendationBanner,
  ] = useState(true);

  const [listOfAnnouncements, setListOfAnnouncements] = useState<
    Announcement[]
  >([]);
  const [isFetchingListOfAnnouncements, setIsFetchingListOfAnnouncements] =
    useState(false);

  const ITEMS = [
    {
      id: 0,
      title: "Activate IA Announcement Bar",
      description:
        "Open the theme editor and enable IA Announcement Bar by changing its status from 'Disabled' to 'Active'.",
      complete: false,
      loading: true,
      primaryButton: {
        content: "Activate",
        props: {
          onAction: () => {
            window.open(
              `https://${window.shopify.config.shop}/admin/themes/current/editor?context=apps&template=index&activateAppId=${activateAppId}/app-embed-block`
            );
          },
        },
      },
    },
    {
      id: 1,
      title: "Create your first announcement",
      description:
        "Create your first announcement by clicking on the 'Create Announcement' button.",
      complete: false,
      loading: true,
      primaryButton: {
        content: "Create Announcement",
        props: {
          onAction: () => {
            navigate("/app/choose-announcement-type");
            shopify.loading(true);
          },
        },
      },
    },
  ];

  const [items, setItems] = useState<any>(ITEMS);

  // Example of step complete handler, adjust for your use case
  const onStepComplete = async (id: any) => {
    try {
      setItems((prev: any) =>
        prev.map((item: any) =>
          item.id === id ? { ...item, complete: true, loading: false } : item
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const onLoadingFalseSetupGuide = async (id: any) => {
    try {
      setItems((prev: any) =>
        prev.map((item: any) =>
          item.id === id ? { ...item, loading: false } : item
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  // This function is used to fetch the isAppActive status for the storefront
  const fetchIsAppActiveInStorefront = async () => {
    try {
      const url = new URL(`${BACKEND_URL}/api/is-app-active`);

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.log("fetchIsAppActiveInStorefront error", error);
    }
  };

  // This function is used to fetch the list of announcements from the backend
  const fetchListOfAnnouncements = async () => {
    try {
      setIsFetchingListOfAnnouncements(true);
      const response = await fetch(`${BACKEND_URL}/api/announcement-home-page`);
      const data = await response.json();
      setListOfAnnouncements(data.listOfAnnouncements);
      setIsFetchingListOfAnnouncements(false);
      return data.listOfAnnouncements;
    } catch (error) {
      console.error("fetchListOfAnnouncements error", error);
      setIsFetchingListOfAnnouncements(false);
      throw error;
    }
  };

  useEffect(() => {
    // setItems(ITEMS);
    shopify.loading(false);

    const getDoNotShowReviewBannerHomePageData =
      HomePageStorageUtils.getDoNotShowReviewBannerHomePage();
    setDoNotShowReviewBanner(
      getDoNotShowReviewBannerHomePageData === "true" ? true : false
    );

    const getDoNotShowAppRecommndationOnHomePageData =
      HomePageStorageUtils.getDoNotShowAppRecommndationOnHomePage();
    setDoNotShowAppRecommendationBanner(
      getDoNotShowAppRecommndationOnHomePageData === "true" ? true : false
    );

    const getDoNotShowSetupGuideHomePageData =
      HomePageStorageUtils.getDoNotShowSetupGuideHomePage();
    setDoNotShowSetupGuide(
      getDoNotShowSetupGuideHomePageData === "true" ? true : false
    );

    const shopUrl = window.shopify.config.shop ?? "";

    fetchIsAppActiveInStorefront()
      .then((data) => {
        const isAppActive = data?.isAppActive ?? true;
        if (isAppActive) onStepComplete(0);
        onLoadingFalseSetupGuide(0);
      })
      .catch((error) => {
        console.error(
          "There was an error in fetchIsAppActiveInStorefront!",
          error
        );
        onLoadingFalseSetupGuide(0);
      });

    fetchListOfAnnouncements().then((data) => {
      if (data.length > 0) onStepComplete(1);
      onLoadingFalseSetupGuide(1);
    });
  }, []);

  const resourceName = {
    singular: "announcement",
    plural: "announcements",
  };

  return (
    <Page>
      <Layout>
        <Layout.Section></Layout.Section>
        <Layout.Section>
          <InlineStack gap="400" align="space-between">
            <Text variant="headingLg" as="h5">
              Announcements
            </Text>
            <Button
              variant="primary"
              onClick={() => navigate("/app/choose-announcement-type")}
            >
              Create Announcement
            </Button>
          </InlineStack>
        </Layout.Section>
        <Layout.Section>
          {!isFetchingListOfAnnouncements && listOfAnnouncements.length > 0 && (
            <Card padding={"0"} roundedAbove="xs">
              <IndexTable
                resourceName={resourceName}
                itemCount={listOfAnnouncements.length}
                headings={[
                  { title: "Announcement name" },
                  { title: "Type" },
                  { title: "Placement" },
                  { title: "Status" },
                ]}
                selectable={false}
              >
                {listOfAnnouncements.map(
                  (
                    {
                      id,
                      name,
                      type,
                      published,
                      placement,
                      announcementPageType,
                    },
                    index
                  ) => (
                    <IndexTable.Row
                      id={id}
                      key={id}
                      position={index}
                      onClick={() => {
                        navigate(
                          `/app/announcement/${id}?announcementType=${announcementPageType}`
                        );
                      }}
                    >
                      <IndexTable.Cell>
                        <BlockStack gap={"050"}>
                          <Text variant="bodyMd" fontWeight="bold" as="span">
                            {name}
                          </Text>
                          <Text variant="bodySm" as="span" tone="subdued">
                            {id}
                          </Text>
                        </BlockStack>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{type?.toUpperCase()}</IndexTable.Cell>
                      <IndexTable.Cell>
                        {placement?.placementPosition ?? ""}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone={published ? "success" : undefined}>
                          {published ? "Published" : "Unpublished"}
                        </Badge>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  )
                )}
              </IndexTable>
            </Card>
          )}
          {!isFetchingListOfAnnouncements &&
            listOfAnnouncements.length === 0 && (
              <Card padding={"0"}>
                <EmptyState
                  heading="No Announcements"
                  action={{
                    content: "Create Announcement",
                    onAction: () => {
                      navigate("/app/choose-announcement-type");
                    },
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>
                    Create your first announcement by clicking on the 'Create
                    Announcement' button.
                  </p>
                </EmptyState>
              </Card>
            )}
          {isFetchingListOfAnnouncements && (
            <Card padding={"600"}>
              <SkeletonBodyText lines={5} />
            </Card>
          )}
        </Layout.Section>

        {!doNotShowSetupGuide && items && (
          <Layout.Section>
            <SetupGuide
              onDismiss={() => {
                setDoNotShowSetupGuide(true);
                HomePageStorageUtils.setDoNotShowSetupGuideHomePage("true");
              }}
              onStepComplete={onStepComplete}
              items={items}
            />
          </Layout.Section>
        )}
        <Layout.Section>
          <MediaCard
            title="Check our other App - IA: Cart Drawer Cart Upsell"
            primaryAction={{
              content: "Install Now",
              onAction: () => {
                window.open(
                  "https://apps.shopify.com/ia-cart-drawer-free-gifts",
                  "_blank"
                );
              },
            }}
            description="Boost AOV with IA: Cart Drawer, cart upsell & cross sell, rewards bar, free gifts and add-ons."
            popoverActions={[
              {
                content: "Dismiss",
                onAction: () => {
                  setDoNotShowAppRecommendationBanner(true);
                  HomePageStorageUtils.setDoNotShowAppRecommndationOnHomePage(
                    "true"
                  );
                },
              },
            ]}
          >
            <img
              alt=""
              width="100%"
              height="100%"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              src="https://cdn.shopify.com/app-store/listing_images/f4465913b474824b9a8b21469ed5aeb6/promotional_image/CKaI2YXfwIkDEAE=.png?height=720&width=1280"
            />
          </MediaCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
