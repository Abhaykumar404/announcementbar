import {
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  FormLayout,
  InlineStack,
  List,
  RadioButton,
  Text,
} from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAnnouncementPlacement } from "app/store/slices/announcement-slice";
import { AnnouncementPlacement } from "app/utils/enums/announcement-placement-enum";

const PlacementSelectionComponent = () => {
  const announcement = useSelector((state: any) => state.announcement);
  const dispatch = useDispatch();

  const handleCollectionSelection = useCallback(
    async ({ presetCollectionId }: { presetCollectionId: any[] }) => {
      const listOfCollectionsSelectedByUser = await shopify.resourcePicker({
        type: "collection",
        action: "select",
        selectionIds: presetCollectionId,
        multiple: true,
      });

      if (
        !listOfCollectionsSelectedByUser ||
        listOfCollectionsSelectedByUser?.length < 1
      ) {
        return;
      }

      const listOfCollections = listOfCollectionsSelectedByUser.map(
        (collectionSelectedByUser: any) => {
          const selectedCollection = {
            gId: collectionSelectedByUser?.id,
            handle: collectionSelectedByUser?.handle,
            title: collectionSelectedByUser?.title,
            shortId: collectionSelectedByUser?.id.split("/").pop(),
          };
          return selectedCollection;
        }
      );

      return listOfCollections;
    },
    []
  );

  const handleProductSelection = useCallback(
    async ({ presetProductId }: { presetProductId: any[] }) => {
      console.log("presetProductId", presetProductId);
      const listOfProductsSelectedByUser = await shopify.resourcePicker({
        type: "product",
        action: "select",
        selectionIds: presetProductId,
        multiple: true,
        filter: {
          variants: false,
        },
      });

      if (
        !listOfProductsSelectedByUser ||
        listOfProductsSelectedByUser?.length < 1
      ) {
        return;
      }

      const listOfProducts = listOfProductsSelectedByUser.map(
        (productSelectedByUser: any) => {
          const selectedProduct = {
            gId: productSelectedByUser?.id,
            handle: productSelectedByUser?.handle,
            title: productSelectedByUser?.title,
            shortId: productSelectedByUser?.id.split("/").pop(),
          };
          return selectedProduct;
        }
      );

      return listOfProducts;
    },
    []
  );

  return (
    <Card padding={"0"}>
      <Box padding="400">
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">
            Select pages to display the bar
          </Text>
          <BlockStack gap="400">
            <RadioButton
              label="Every page"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.EVERY_PAGE
              }
              name="announcement-placement"
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition: AnnouncementPlacement.EVERY_PAGE,
                  })
                );
              }}
            />
            <RadioButton
              label="Home page only"
              name="announcement-placement"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.HOME_PAGE_ONLY
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition: AnnouncementPlacement.HOME_PAGE_ONLY,
                  })
                );
              }}
            />
            <RadioButton
              label="All product pages"
              name="announcement-placement"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.ALL_PRODUCT_PAGES
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition: AnnouncementPlacement.ALL_PRODUCT_PAGES,
                  })
                );
              }}
            />
            {/* <RadioButton
              label="All products in specific collections"
              name="announcement-placement"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.ALL_PRODUCTS_IN_SPECIFIC_COLLECTIONS
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition:
                      AnnouncementPlacement.ALL_PRODUCTS_IN_SPECIFIC_COLLECTIONS,
                  })
                );
              }}
            /> */}

            {/* <Button
              disabled={
                announcement?.placement?.placementPosition !==
                AnnouncementPlacement.ALL_PRODUCTS_IN_SPECIFIC_COLLECTIONS
              }
              onClick={async () => {
                const listOfCollections: any = await handleCollectionSelection({
                  presetCollectionId:
                    announcement?.placement?.showOnProductsInCollections.map(
                      (collection: any) => {
                        return { id: collection.gId };
                      }
                    ),
                });

                console.log("listOfCollections", listOfCollections);

                if (listOfCollections && listOfCollections?.length > 0) {
                  dispatch(
                    setAnnouncementPlacement({
                      showOnProductsInCollections: listOfCollections,
                    })
                  );
                }
              }}
            >
              Select collections
            </Button> */}

            {announcement?.placement?.placementPosition ===
              AnnouncementPlacement.ALL_PRODUCTS_IN_SPECIFIC_COLLECTIONS &&
              announcement?.placement?.showOnProductsInCollections?.length >
                0 && (
                <List>
                  {announcement?.placement?.showOnProductsInCollections?.map(
                    (collection: any) => (
                      <List.Item key={collection?.gId}>
                        {collection?.title}
                      </List.Item>
                    )
                  )}
                </List>
              )}

            <RadioButton
              label="Specific product page"
              name="announcement-placement"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.SPECIFIC_PRODUCT_PAGE
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition:
                      AnnouncementPlacement.SPECIFIC_PRODUCT_PAGE,
                  })
                );
              }}
            />

            <Button
              disabled={
                announcement?.placement?.placementPosition !==
                AnnouncementPlacement.SPECIFIC_PRODUCT_PAGE
              }
              onClick={async () => {
                const listOfProducts: any = await handleProductSelection({
                  presetProductId: announcement?.placement?.showOnProducts.map(
                    (product: any) => {
                      return { id: product.gId };
                    }
                  ),
                });

                if (listOfProducts && listOfProducts?.length > 0) {
                  dispatch(
                    setAnnouncementPlacement({
                      showOnProducts: listOfProducts,
                    })
                  );
                }
              }}
            >
              Select Products
            </Button>

            {announcement?.placement?.placementPosition ===
              AnnouncementPlacement.SPECIFIC_PRODUCT_PAGE &&
              announcement?.placement?.showOnProducts?.length > 0 && (
                <List>
                  {announcement?.placement?.showOnProducts?.map(
                    (product: any) => (
                      <List.Item key={product?.gId}>{product?.title}</List.Item>
                    )
                  )}
                </List>
              )}

            <RadioButton
              label="All collections page"
              name="announcement-placement"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.ALL_COLLECTIONS_PAGE
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition:
                      AnnouncementPlacement.ALL_COLLECTIONS_PAGE,
                  })
                );
              }}
            />

            <RadioButton
              label="Specific collection page"
              name="announcement-placement"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.SPECIFIC_COLLECTION_PAGE
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition:
                      AnnouncementPlacement.SPECIFIC_COLLECTION_PAGE,
                  })
                );
              }}
            />

            <Button
              disabled={
                announcement?.placement?.placementPosition !==
                AnnouncementPlacement.SPECIFIC_COLLECTION_PAGE
              }
              onClick={async () => {
                const listOfCollections: any = await handleCollectionSelection({
                  presetCollectionId:
                    announcement?.placement?.showOnCollections.map(
                      (collection: any) => {
                        return { id: collection.gId };
                      }
                    ),
                });

                if (listOfCollections && listOfCollections?.length > 0) {
                  dispatch(
                    setAnnouncementPlacement({
                      showOnCollections: listOfCollections,
                    })
                  );
                }
              }}
            >
              Select Collections
            </Button>

            {announcement?.placement?.placementPosition ===
              AnnouncementPlacement.SPECIFIC_COLLECTION_PAGE &&
              announcement?.placement?.showOnCollections?.length > 0 && (
                <List>
                  {announcement?.placement?.showOnCollections?.map(
                    (collection: any) => (
                      <List.Item key={collection?.gId}>
                        {collection?.title}
                      </List.Item>
                    )
                  )}
                </List>
              )}

            <RadioButton
              label="Custom position"
              helpText="Add announcement using app blocks or code snippet provided below."
              name="announcement-placement"
              checked={
                announcement?.placement?.placementPosition ===
                AnnouncementPlacement.CUSTOM_POSITION
              }
              onChange={(value: boolean) => {
                dispatch(
                  setAnnouncementPlacement({
                    placementPosition: AnnouncementPlacement.CUSTOM_POSITION,
                  })
                );
              }}
            />
          </BlockStack>
        </BlockStack>
      </Box>
      <Divider />
      <Box padding="400">
        <BlockStack gap={"200"}>
          <InlineStack align="space-between">
            <Text as="h2" variant="headingMd">
              Announcement Id
            </Text>
            <Button
              icon={ClipboardIcon}
              variant="monochromePlain"
              onClick={() => {
                if (announcement?.id) {
                  navigator.clipboard.writeText(announcement.id).then(
                    () => {
                      console.log(
                        "Announcement ID copied to clipboard successfully!"
                      );
                      shopify.toast.show(
                        "Announcement ID copied to clipboard successfully!"
                      );
                    },
                    (err) => {
                      console.error("Failed to copy snippet: ", err);
                      shopify.toast.show("Failed to copy snippet: ", err);
                    }
                  );
                } else {
                  console.warn("No announcement ID available to copy.");
                  shopify.toast.show("No announcement ID available to copy.");
                }
              }}
            ></Button>
          </InlineStack>
          <Text as="p" variant="bodySm">
            {announcement?.id || "Save or Publish to show timer ID"}
          </Text>
          <Text as="p" variant="bodyMd">
            Announcement bar app block can be added, removed, repositioned, and
            customized through the theme editor using announcement ID.
          </Text>
        </BlockStack>
      </Box>
      <Divider />

      {announcement?.placement?.placementPosition ===
        AnnouncementPlacement.CUSTOM_POSITION && (
        <Box padding="400">
          <BlockStack gap={"200"}>
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Announcement bar code snippet
              </Text>
              <Button
                icon={ClipboardIcon}
                variant="monochromePlain"
                onClick={() => {
                  if (announcement?.id) {
                    const snippet = `<div class="ia-announcement-block" id="${announcement.id}"></div>`;
                    navigator.clipboard.writeText(snippet).then(
                      () => {
                        console.log(
                          "Snippet copied to clipboard successfully!"
                        );
                        shopify.toast.show(
                          "Snippet copied to clipboard successfully!"
                        );
                      },
                      (err) => {
                        console.error("Failed to copy snippet: ", err);
                        shopify.toast.show("Failed to copy snippet: ", err);
                      }
                    );
                  } else {
                    console.warn("No announcement ID available to copy.");
                    shopify.toast.show("No announcement ID available to copy.");
                  }
                }}
              ></Button>
            </InlineStack>

            {announcement?.id && (
              <Box
                padding="200"
                background="bg-fill-disabled"
                borderRadius="100"
                borderWidth="025"
                borderColor="border-secondary"
              >
                {`<div
                class="ia-announcement-block"
                id="ia-announcement-block-${announcement?.id}"
                ></div>`}
              </Box>
            )}
          </BlockStack>
        </Box>
      )}
    </Card>
  );
};

export default PlacementSelectionComponent;
