async function getAnnouncementData() {
  try {
    const response = await fetch("/apps/data", {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

(async function announcementBar() {
  const announcementData = await getAnnouncementData();

  if (!announcementData || !announcementData.announcements) {
    return;
  }

  const fonts = {
    helvetica: "Helvetica",
    arial: "Arial",
    tahoma: "Tahoma",
    treubuchet_ms: "Trebuchet MS",
    times_new_roman: "Times New Roman",
    georgia: "Georgia",
    garamond: "Garamond",
    courier_new: "Courier New",
  };
  const defaultFont =
    "Helvetica, 'Helvetica Neue', Arial, 'Lucida Grande', sans-serif";

  announcementData.announcements.forEach(async (data) => {
    const { design, placement, scheduled } = data;

    let localStorageData = JSON.parse(
      window.localStorage.getItem(`announcementBarClosed_${data.id}`)
    );
    if (
      localStorageData &&
      localStorageData.id === data.id &&
      localStorageData.value &&
      localStorageData.updatedAt === data.updatedAt
    )
      return;
    if (
      shouldDisplayAnnouncement(scheduled.start, scheduled.end) &&
      (await canShowInCountry(placement)) &&
      canShowOnHomePage(placement.pages_type) &&
      canShowInProduct(placement.pages, placement.pages_type) &&
      canShowOnCollection(placement.pages, placement.pages_type)
    ) {
      // announcment bar
      const bar = document.createElement("div");
      bar.className = `futureblink-announcement-bar futureblink-announcement-bar_${
        data.id
      } ${
        placement.pages_type === "custom"
          ? "relative"
          : design.position === "bottom"
          ? "sticky-bottom"
          : design.position === "top" && design.sticky
          ? "sticky-top"
          : ""
      }`;
      bar.style.background = design.gradient
        ? `linear-gradient(${design.angle}deg,${design.initial_color},${design.final_color})`
        : design.color;
      bar.style.border = `${design.border_size}px solid ${design.border_color}`;
      bar.style.borderRadius = `${design.bar_corner_radius}px`;
      bar.style.fontFamily = fonts[design.font] || defaultFont;
      bar.style.zIndex = design.sticky && design.position === "top" ? 11 : 10;

      // media query style
      const style = document.createElement("style");
      style.type = "text/css";

      const styles = `
        @media (max-width:620px) {
          .futureblink-announcement-bar_${data.id} .title {
              font-size: ${Number(design.title_size) - 4}px !important;
          }
  
          .futureblink-announcement-bar_${data.id} .subheading {
              font-size: ${Number(design.subheading_size) - 3}px !important;
          }
  
          .futureblink-announcement-bar_${data.id} .cta-button {
              font-size: ${Number(design.button_text_size) - 3}px !important;
          }
          }
            `;
      style.innerHTML = styles;
      document.head.appendChild(style);

      if (data.type === "simple") simpleAnnouncementBar(data, design, bar);
      else if (data.type === "running")
        runningAnnouncementBar(data, design, bar);
      else multipleAnnouncementBar(data, design, bar);

      // close button
      if (data.closable) {
        const closeBtn = document.createElement("button");
        closeBtn.addEventListener("click", () => {
          bar.parentNode.removeChild(bar);
          window.localStorage.setItem(
            `announcementBarClosed_${data.id}`,
            JSON.stringify({
              id: data.id,
              value: true,
              updatedAt: data.updatedAt,
            })
          );
        });
        closeBtn.className = "close-btn";
        closeBtn.innerHTML = `<svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m7.414 6 4.293-4.293A.999.999 0 1 0 10.293.293L6 4.586 1.707.293A.999.999 0 1 0 .293 1.707L4.586 6 .293 10.293a.999.999 0 1 0 1.414 1.414L6 7.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L7.414 6Z" fill=${design.close_icon_color}></path></svg>`;
        bar.appendChild(closeBtn);
      }
      if (placement.pages_type === "custom") {
        // const announcementBlock = document.getElementById(`${data.id}`);
        const announcementBlocks = document.querySelectorAll(
          ".futureblink-announcement-block"
        );

        announcementBlocks.forEach((block) => {
          const blockId = block.id;
          if (blockId === data.id) {
            const barClone = bar.cloneNode(true);
            block.appendChild(barClone);
          }
        });
        // announcementBlock.appendChild(bar);
      } else {
        const body = document.querySelector("body");
        body.prepend(bar);
      }
    }
  });

  function simpleAnnouncementBar(data, design, bar) {
    data.content.slice(0, 1).forEach((content) => {
      let innerDiv = document.createElement("div");
      const textContainer = document.createElement("div");
      innerDiv.className = "announcement-inner";
      const title = document.createElement("h2");
      title.className = "title";
      title.textContent = content.title;
      title.style.fontSize = design.title_size + "px";
      title.style.color = design.title_color;
      title.style.fontFamily = fonts[design.font] || defaultFont;
      title.style.textAlign = content.cta_type === "button" ? "left" : "center";
      textContainer.appendChild(title);

      if (data.type !== "running") {
        const subHeading = document.createElement("p");
        subHeading.className = "subheading";
        subHeading.textContent = content.subheading;
        subHeading.style.fontSize = design.subheading_size + "px";
        subHeading.style.color = design.subheading_color;
        subHeading.style.fontFamily = fonts[design.font] || defaultFont;
        subHeading.style.textAlign =
          content.cta_type === "button" ? "left" : "center";
        textContainer.appendChild(subHeading);
      }
      innerDiv.appendChild(textContainer);

      if (content.cta_type == "full") {
        innerDiv = document.createElement("a");
        innerDiv.className = "announcement-inner";
        innerDiv.setAttribute("href", content.cta_link);
        innerDiv.appendChild(textContainer);
      }

      if (content.cta_type === "button") {
        const ctaButton = document.createElement("a");
        ctaButton.setAttribute("href", content.cta_link);
        ctaButton.className = "cta-button";
        ctaButton.textContent = content.cta_button_text;
        ctaButton.style.background = design.button_color;
        ctaButton.style.fontSize = design.button_text_size + "px";
        ctaButton.style.color = design.button_text_color;
        ctaButton.style.borderRadius = design.button_corner_radius + "px";
        innerDiv.appendChild(ctaButton);
      }

      bar.appendChild(innerDiv);
    });
  }

  function runningAnnouncementBar(data, design, bar) {
    const calculateDuration = (value) => {
      const minDuration = 130;
      const maxDuration = 13000;
      return (
        maxDuration - ((value - 1) * (maxDuration - minDuration)) / (100 - 1)
      );
    };

    const duration = calculateDuration(data.duration);

    data.content.slice(0, 1).map((content) => {
      let innerDiv = document.createElement("a");
      innerDiv.className = "announcement-inner_running";

      const swiperContainer = `<div class="swiper-${data.id}">
              <div class="swiper-wrapper">
                  ${Array.from({ length: 10 })
                    .map(
                      () =>
                        `<div class="swiper-slide"><span class="title" style="font-size:${
                          design.title_size
                        }px;color:${design.title_color};font-family:${
                          fonts[design.font] || defaultFont
                        }">${content.title}</span></div>`
                    )
                    .join("")}
              </div>
              </div>`;

      innerDiv.innerHTML = swiperContainer;

      if (content.cta_type == "full") {
        innerDiv = document.createElement("a");
        innerDiv.className = "announcement-inner_running";
        innerDiv.setAttribute("href", content.cta_link);
        innerDiv.innerHTML = swiperContainer;
      }

      bar.appendChild(innerDiv);

      if (content.cta_type === "button") {
        const ctaButton = document.createElement("a");
        ctaButton.setAttribute("href", content.cta_link);
        ctaButton.className = "cta-button";
        ctaButton.textContent = content.cta_button_text;
        ctaButton.style.background = design.button_color;
        ctaButton.style.fontSize = design.button_text_size + "px";
        ctaButton.style.color = design.button_text_color;
        ctaButton.style.borderRadius = design.button_corner_radius + "px";
        bar.appendChild(ctaButton);
      }

      requestAnimationFrame(() => {
        const swiperContainer = document.querySelector(`.swiper-${data.id}`);
        const swiper = new Swiper(swiperContainer, {
          loop: true,
          freeMode: true,
          spaceBetween: 26,
          slidesPerView: "auto",
          loop: true,
          autoplay: {
            delay: 0,
            disableOnInteraction: true,
          },
          freeMode: true,
          speed: duration,
          freeModeMomentum: false,
        });
      });
    });
  }

  function multipleAnnouncementBar(data, design, bar) {
    const innerDiv = document.createElement("div");
    innerDiv.className = "announcement-inner_multiple";
    const swiperContainer = `
      <button id="button-prev" class="navigation-button">
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16C11.744 16 11.488 15.902 11.293 15.707L6.29301 10.707C5.90201 10.316 5.90201 9.68401 6.29301 9.29301L11.293 4.29301C11.684 3.90201 12.316 3.90201 12.707 4.29301C13.098 4.68401 13.098 5.31601 12.707 5.70701L8.41401 10L12.707 14.293C13.098 14.684 13.098 15.316 12.707 15.707C12.512 15.902 12.256 16 12 16Z" fill=${
                    design.arrow_icon_color
                  }></path></svg>
              </button>
          <div class="swiper-${data.id}">
              <div class="swiper-wrapper">
                  ${data.content
                    .map(
                      (content) => `
                          <div class="swiper-slide">
                              ${
                                content.cta_type === "full"
                                  ? `<a href="${
                                      content.cta_link
                                    }" class="announcement-inner">
                                      <div>
                                          <p class="title" style="text-align:${
                                            content.cta_type === "button"
                                              ? "left"
                                              : "center"
                                          };font-size:${
                                      design.title_size
                                    }px;color:${
                                      design.title_color
                                    };font-family:${
                                      fonts[design.font] || defaultFont
                                    }">
                                              ${content.title}
                                          </p>
                                          ${
                                            content.subheading
                                              ? `<p style="text-align:${
                                                  content.cta_type === "button"
                                                    ? "left"
                                                    : "center"
                                                };font-size:${
                                                  design.subheading_size
                                                }px;color:${
                                                  design.subheading_color
                                                };font-family:${
                                                  fonts[design.font] ||
                                                  defaultFont
                                                }">
                                                  ${content.subheading}
                                              </p>`
                                              : ""
                                          }
                                      </div>
                                  </a>`
                                  : `<div class="announcement-inner">
                                      <div>
                                          <p class="title" style="text-align:${
                                            content.cta_type === "button"
                                              ? "left"
                                              : "center"
                                          };font-size:${
                                      design.title_size
                                    }px;color:${
                                      design.title_color
                                    };font-family:${
                                      fonts[design.font] || defaultFont
                                    }">
                                              ${content.title}
                                          </p>
                                          
                                          ${
                                            content.subheading
                                              ? `<p class="subheading" style="text-align:${
                                                  content.cta_type === "button"
                                                    ? "left"
                                                    : "center"
                                                };font-size:${
                                                  design.subheading_size
                                                }px;color:${
                                                  design.subheading_color
                                                };font-family:${
                                                  fonts[design.font] ||
                                                  defaultFont
                                                }">
                                                  ${content.subheading}
                                              </p>`
                                              : ""
                                          }
                                      </div>
                                      ${
                                        content.cta_type === "button"
                                          ? `<a class="cta-button" style="font-size:${design.button_text_size}px;background-color:${design.button_color};border-radius:${design.button_corner_radius}px;color:${design.button_text_color};" href=${content.cta_link}>
                                              ${content.cta_button_text}
                                          </a>`
                                          : ""
                                      }
                                  </div>`
                              }
                          </div>
                      `
                    )
                    .join("")}
              </div>
              
              
          </div>
          <button id="button-next" class="navigation-button">
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00001 16C7.74401 16 7.48801 15.902 7.29301 15.707C6.90201 15.316 6.90201 14.684 7.29301 14.293L11.586 10L7.29301 5.70701C6.90201 5.31601 6.90201 4.68401 7.29301 4.29301C7.68401 3.90201 8.31601 3.90201 8.70701 4.29301L13.707 9.29301C14.098 9.68401 14.098 10.316 13.707 10.707L8.70701 15.707C8.51201 15.902 8.25601 16 8.00001 16Z" fill=${
                    design.arrow_icon_color
                  }></path></svg>
              </button>
      `;

    innerDiv.innerHTML = swiperContainer;

    bar.appendChild(innerDiv);

    requestAnimationFrame(() => {
      const swiperContainerElement = document.querySelector(
        `.swiper-${data.id}`
      );
      if (swiperContainerElement) {
        const swiper = new Swiper(swiperContainerElement, {
          slidesPerView: 1,
          loop: true,
          autoplay: { delay: data.duration * 1000 },
          spaceBetween: 26,
          draggable: false,
          navigation: {
            prevEl: "#button-prev",
            nextEl: "#button-next",
          },
        });
      }
    });
  }

  function shouldDisplayAnnouncement(startTime, endTime) {
    const now = new Date();

    // Check if the announcement should be displayed indefinitely
    if (!startTime && !endTime) {
      return true;
    }

    // If only startTime exists, check if it's time to show the announcement
    if (startTime && !endTime) {
      return now >= new Date(startTime);
    }

    // If only endTime exists, show until endTime is reached
    if (!startTime && endTime) {
      return now <= new Date(endTime);
    }

    // If both startTime and endTime exist, show within the time range
    if (startTime && endTime) {
      return now >= new Date(startTime) && now <= new Date(endTime);
    }

    return false;
  }

  function canShowInProduct(pages, pageType) {
    if (
      pageType === "all_product" &&
      !window.location.pathname.includes("/products/")
    )
      return false;
    if (pages.length !== 0 && pageType === "specific_product") {
      const path = decodeURI(window.location.pathname);

      let showOnProduct = pages.find((product) => {
        return path.includes(`products/${product.handle}`);
      });

      if (!showOnProduct) return false;
    }

    if (pages.length !== 0 && pageType === "all_product_in_collection") {
      const productCollections = window.announcementMeta.collections || [];

      const showOnProduct = pages.find((collection) => {
        const collectionId = Number(collection.id.split("/").pop());
        return productCollections.some(
          (product) => product.id === collectionId
        );
      });

      if (!showOnProduct) return false;
    }
    return true;
  }

  function canShowOnHomePage(pageType) {
    let homePage = window.Shopify.routes.root || "/";
    if (homePage.length > 1) {
      homePage = homePage.slice(0, homePage.length - 1);
    }
    const isHomePage = window.location.pathname === homePage;
    if (pageType === "home" && !isHomePage) return false;

    return true;
  }

  function canShowOnCollection(pages, pageType) {
    if (
      pageType === "all_collection" &&
      !window.location.pathname.includes("/collections/")
    )
      return false;
    if (pages.length && pageType === "specific_collection") {
      const path = decodeURI(window.location.pathname);

      const showOnCollection = pages.find((collection) =>
        path.includes(`collections/${collection.handle}`)
      );

      if (!showOnCollection) return false;
    }

    return true;
  }

  async function canShowInCountry(data) {
    if (!data.allowed_all_location) {
      const countryCode = await fetchLocation();
      return data.locations.some((country) => country.code === countryCode);
    }

    return true;
  }

  async function fetchLocation() {
    try {
      const response = await fetch("https://ipapi.co/json/");

      if (!response.ok) throw Error("failed to fetch");

      const locationData = await response.json();
      return locationData.country_code;
    } catch (error) {
      console.log("error fetching location", error);
    }
  }
})();
