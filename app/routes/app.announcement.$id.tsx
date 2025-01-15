import {
  Badge,
  Banner,
  BlockStack,
  Card,
  Icon,
  InlineStack,
  Layout,
  Link,
  List,
  Page,
  SkeletonBodyText,
  Tabs,
  Text,
} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import ContentTabIndex from "./content-tab/content-tab-index";
import DesignTabIndex from "./design-tab/design-tab-index";
import PlacementTabIndex from "./placement-tab/placement-tab-index";
import AnnouncementBar from "./preview/announcement-bar";
import {
  ContentIcon,
  PaintBrushFlatIcon,
  ThemeTemplateIcon,
} from "@shopify/polaris-icons";
import { useDispatch, useSelector } from "react-redux";
import { useBlocker, useLocation, useNavigate } from "@remix-run/react";
import {
  resetUnsavedChanges,
  setWholeStateWithTranslations,
} from "app/store/slices/announcement-slice";
import {
  setDiscardedState,
  setListOfErrors,
} from "../store/slices/global-state-slice";
import { BACKEND_URL } from "../utils/constants";
import SkeletonBigBlock from "../common-components/skeleton-big-block";

const AnnouncementConfigrationPage = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingAnnouncement, setIsFetchingAnnouncement] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    []
  );

  const announcement = useSelector((state: any) => state.announcement);
  const [showTextFieldsError, setShowTextFieldsError] = useState(false);
  const listOfTextFieldErrors = useSelector(
    (state: any) => state.globalState.listOfErrors
  );

  const location = useLocation();
  const navigate = useNavigate();

  const discardedState = useSelector(
    (state: any) => state.globalState.discardState
  );

  // This hook will tell whether the user is trying to leave the page and is blocked
  useBlocker(({ currentLocation, nextLocation }) => {
    return (
      announcement?.hasUnsavedChanges &&
      currentLocation.pathname !== nextLocation.pathname
    );
  });

  // This effect will show the save bar when there are unsaved changes
  useEffect(() => {
    if (announcement?.hasUnsavedChanges) {
      const csb = document.getElementById("announcement-save-bar");
      // @ts-ignore
      csb?.show();
    }
  }, [announcement?.hasUnsavedChanges]);

  // handle the save button click
  const handleSaveButtonClick = useCallback(
    async ({
      publish = false,
      save = false,
    }: {
      publish?: boolean;
      save?: boolean;
    }) => {
      if (isDeleteLoading) return;
      setIsSaving(true);
      setIsPublishLoading(true);
      const { hasUnsavedChanges, createdAt, ...dataToSend } = announcement;
      dataToSend.published = publish;
      dataToSend.shop = window?.shopify?.config?.shop;

      if (!dataToSend.shop) {
        shopify.toast.show("Shop is not found", {
          isError: true,
        });
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/announcement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);

        // Handle success
        shopify.toast.show(
          `Announcement ${
            save ? "Saved" : publish ? "Published" : "Unpublished"
          } Successfully`
        );
        dispatch(resetUnsavedChanges());
        dispatch(setWholeStateWithTranslations(responseData.data));
        dispatch(setDiscardedState(responseData.data));

        const announcementId = responseData.data.id;
        const csb = document.getElementById("announcement-save-bar");

        // @ts-ignore
        csb?.hide();
        // navigate to /app/announcement/$id
        setTimeout(() => {
          navigate(`/app/announcement/${announcementId}`, {
            replace: true,
          });
        }, 100);
        // window.location.href = `/app/announcement/${announcementId}`;
      } else {
        const responseData = await response.json();
        const responseBody = await response.body;
        console.error("Action failed", responseData, responseBody);
        // Handle failure
        shopify.toast.show("Error saving Announcement data!", {
          isError: true,
        });
      }
      setIsSaving(false);
      setIsPublishLoading(false);
    },
    [announcement, dispatch, isDeleteLoading, navigate]
  );

  const onContexualSaveButtonClick = async ({
    publish = false,
    save = false,
  }: {
    publish?: boolean;
    save?: boolean;
  }) => {
    setTimeout(() => {
      const doesAnyErrorExist = Object.keys(listOfTextFieldErrors).length > 0;

      if (doesAnyErrorExist) {
        setShowTextFieldsError(true);
      } else {
        setShowTextFieldsError(false);
        handleSaveButtonClick({ publish, save });
      }
    }, 10);
  };

  // This function will be called when the user clicks on the floating discard button
  const onContexualDiscardButtonClick = async () => {
    const csb = document.getElementById("announcement-save-bar");

    if (csb) {
      try {
        dispatch(resetUnsavedChanges());
        dispatch(setWholeStateWithTranslations(discardedState));
        setShowTextFieldsError(false);
        // @ts-ignore
        csb?.hide();
      } catch (error) {
        console.error("Error in hiding floating save button", error);
      }
    }
  };

  const tabs = useMemo(
    () => [
      {
        id: "content-tab",
        content: (
          <InlineStack gap={"200"}>
            <Icon source={ContentIcon} tone="base" />
            Content
          </InlineStack>
        ),
      },
      {
        id: "design-tab",
        content: (
          <InlineStack gap={"200"}>
            <Icon source={PaintBrushFlatIcon} tone="base" />
            Design
          </InlineStack>
        ),
      },
      {
        id: "placement-tab",
        content: (
          <InlineStack gap={"200"}>
            <Icon source={ThemeTemplateIcon} tone="base" />
            Placement
          </InlineStack>
        ),
      },
    ],
    []
  );

  const fetchAnnouncementData = async () => {
    try {
      setIsFetchingAnnouncement(true);
      const pathSegments = location.pathname.split("/");
      const announcementId = pathSegments[pathSegments.length - 1];
      // fetch initial data from the backend
      const response = await fetch(
        `${BACKEND_URL}/api/announcement?id=${announcementId}`
      );
      const data = await response.json();
      dispatch(setWholeStateWithTranslations(data.announcementData));
      dispatch(setDiscardedState(data.announcementData));
      setIsFetchingAnnouncement(false);
    } catch (error) {
      console.error("Error in fetching announcement", error);
      setIsFetchingAnnouncement(false);
    }
  };

  const deleteAnnouncement = useCallback(async () => {
    try {
      setIsDeleteLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/delete-announcement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: announcement?.id }),
      });
      const data = await response.json();
      console.log("data", data);
      if (data.success) {
        shopify.toast.show("Announcement deleted successfully");
        navigate("/app");
      }
      setIsDeleteLoading(false);
    } catch (error) {
      console.error("Error in deleting announcement", error);
      setIsDeleteLoading(false);
    }
  }, [announcement?.id, navigate]);

  useEffect(() => {
    fetchAnnouncementData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isFetchingAnnouncement ? (
    <Page>
      <Layout>
        <Layout.Section>
          <InlineStack align="space-between">
            <SkeletonBigBlock />
            <SkeletonBigBlock />
          </InlineStack>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <SkeletonBodyText lines={1} />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Layout>
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="500">
                  <SkeletonBigBlock />
                  <SkeletonBodyText lines={7} />
                  <SkeletonBigBlock />
                  <SkeletonBodyText lines={7} />
                  <SkeletonBigBlock />
                  <SkeletonBodyText lines={7} />
                  <SkeletonBigBlock />
                  <SkeletonBodyText lines={7} />
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <SkeletonBodyText />
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section></Layout.Section>
      </Layout>
    </Page>
  ) : (
    <Page
      title={announcement?.name || "Announcement Name"}
      titleMetadata={
        <Badge tone={announcement?.published ? "success" : undefined}>
          {announcement?.published ? "Published" : "Not Published"}
        </Badge>
      }
      subtitle={announcement?.id || ""}
      primaryAction={{
        content: announcement?.published ? "Unpublish" : "Publish",
        loading: isPublishLoading,
        tone: announcement?.published ? "critical" : "",
        disabled: isDeleteLoading,
        onAction: () => {
          if (!isDeleteLoading)
            onContexualSaveButtonClick({ publish: !announcement?.published });
        },
      }}
      secondaryActions={
        announcement?.id && [
          {
            content: "Delete",
            tone: "critical",
            disabled: isDeleteLoading || isPublishLoading || isSaving,
            loading: isDeleteLoading,
            onAction: deleteAnnouncement,
          },
        ]
      }
      backAction={{
        content: "Back",
        onAction: () => window.history.back(),
      }}
    >
      <Layout>
        {showTextFieldsError && (
          <Layout.Section>
            <Banner
              title="There are some errors in the form"
              action={{
                content: "Contact Support",
                onAction: () => {
                  window.open(
                    "mailto:contact@incredible-apps.com?subject=Cart Editor Error&body=I am facing some issues with the cart editor",
                    "__blank"
                  );
                },
              }}
              tone="critical"
            >
              <p>You can fix the following issues or contact support.</p>
              <List type="bullet">
                {(() => {
                  // Flags to ensure each message is only displayed once
                  let showEmptyMessage = false;
                  let showInvalidHexMessage = false;

                  // Iterate over the object and set flags if necessary
                  Object.keys(listOfTextFieldErrors).forEach((key) => {
                    const errorValue = listOfTextFieldErrors[key];
                    if (errorValue === "Empty") {
                      showEmptyMessage = true;
                    }
                    if (errorValue === "InvalidHexCode") {
                      showInvalidHexMessage = true;
                    }
                  });

                  return (
                    <>
                      {showEmptyMessage && (
                        <List.Item>One or more fields are empty</List.Item>
                      )}
                      {showInvalidHexMessage && (
                        <List.Item>
                          One or More fields have invalid hex code
                        </List.Item>
                      )}
                    </>
                  );
                })()}
              </List>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Layout>
            <Layout.Section>
              <Card padding={"0"}>
                <Tabs
                  fitted
                  tabs={tabs}
                  selected={selectedTab}
                  onSelect={handleTabChange}
                ></Tabs>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section>
          <Layout>
            <Layout.Section variant="oneThird">
              {selectedTab === 0 && <ContentTabIndex />}
              {selectedTab === 1 && <DesignTabIndex />}
              {selectedTab === 2 && <PlacementTabIndex />}
              <div style={{ height: "50px", width: 1 }} />
            </Layout.Section>
            <div
              className="Polaris-Layout__Section"
              style={{ position: "sticky", top: 20 }}
            >
              <AnnouncementBar
                isPreview={true}
                shopLocale={"en"}
                announcementModule={announcement}
              />
            </div>
          </Layout>
        </Layout.Section>
      </Layout>
      <ui-save-bar id="announcement-save-bar">
        {isSaving ? (
          <button
            variant="primary"
            id="announcement-save-button"
            onClick={() => {}}
            loading={`${isSaving}`}
          ></button>
        ) : (
          <button
            variant="primary"
            id="announcement-save-button"
            onClick={() => {
              onContexualSaveButtonClick({
                publish: announcement?.published ?? false,
                save: true,
              });
            }}
          ></button>
        )}
        <button
          id="announcement-discard-button"
          onClick={onContexualDiscardButtonClick}
        ></button>
      </ui-save-bar>
    </Page>
  );
};

export default AnnouncementConfigrationPage;
