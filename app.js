"use strict";

const LIUZHOU_CENTER = { lat: 24.3146, lng: 109.4117 };

const DISTRICT_CENTERS = {
  "城中区": { lat: 24.312324, lng: 109.411749 },
  "鱼峰区": { lat: 24.303848, lng: 109.415364 },
  "柳南区": { lat: 24.287013, lng: 109.395936 },
  "柳北区": { lat: 24.359145, lng: 109.406577 },
  "柳江区": { lat: 24.257512, lng: 109.334503 },
  "柳城县": { lat: 24.655121, lng: 109.245812 },
  "鹿寨县": { lat: 24.483405, lng: 109.740805 },
  "融安县": { lat: 25.214703, lng: 109.403621 },
  "融水苗族自治县": { lat: 25.068812, lng: 109.252744 },
  "三江侗族自治县": { lat: 25.78553, lng: 109.614846 }
};

function mergeFoodPools(localFoods, commonFoods) {
  const seen = new Set();

  return [...(localFoods || []), ...(commonFoods || [])].filter((food) => {
    if (!food || !food.name || seen.has(food.name)) {
      return false;
    }

    seen.add(food.name);
    return true;
  });
}

function createFoodPicker(items, random = Math.random) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("至少需要一个食物选项");
  }

  let previousIndex = -1;

  return {
    pick() {
      if (items.length === 1) {
        previousIndex = 0;
      } else {
        let nextIndex;
        do {
          nextIndex = Math.floor(random() * items.length);
        } while (nextIndex === previousIndex);
        previousIndex = nextIndex;
      }

      return { ...items[previousIndex], index: previousIndex };
    }
  };
}

function pointInRing(lng, lat, ring) {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [lngI, latI] = ring[i];
    const [lngJ, latJ] = ring[j];
    const crossesLatitude = (latI > lat) !== (latJ > lat);
    const crossingLng = ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI;

    if (crossesLatitude && lng < crossingLng) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInPolygon(lng, lat, polygon) {
  if (!Array.isArray(polygon) || polygon.length === 0) {
    return false;
  }

  const [outerRing, ...holes] = polygon;
  if (!pointInRing(lng, lat, outerRing)) {
    return false;
  }

  return !holes.some((hole) => pointInRing(lng, lat, hole));
}

function findDistrictByPoint(features, lng, lat) {
  if (!Array.isArray(features)) {
    return null;
  }

  for (const feature of features) {
    if (!feature || !feature.geometry) {
      continue;
    }

    const coordinates = feature.geometry.coordinates;
    const polygons = feature.geometry.type === "MultiPolygon"
      ? coordinates
      : feature.geometry.type === "Polygon"
        ? [coordinates]
        : [];

    if (polygons.some((polygon) => pointInPolygon(lng, lat, polygon))) {
      return {
        name: feature.properties.name,
        adcode: feature.properties.adcode
      };
    }
  }

  return null;
}

function outOfChina(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

function transformLat(lng, lat) {
  let ret = -100 + 2 * lng + 3 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20 * Math.sin(6 * lng * Math.PI) + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  ret += ((20 * Math.sin(lat * Math.PI) + 40 * Math.sin((lat / 3) * Math.PI)) * 2) / 3;
  ret += ((160 * Math.sin((lat / 12) * Math.PI) + 320 * Math.sin((lat * Math.PI) / 30)) * 2) / 3;
  return ret;
}

function transformLng(lng, lat) {
  let ret = 300 + lng + 2 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20 * Math.sin(6 * lng * Math.PI) + 20 * Math.sin(2 * lng * Math.PI)) * 2) / 3;
  ret += ((20 * Math.sin(lng * Math.PI) + 40 * Math.sin((lng / 3) * Math.PI)) * 2) / 3;
  ret += ((150 * Math.sin((lng / 12) * Math.PI) + 300 * Math.sin((lng / 30) * Math.PI)) * 2) / 3;
  return ret;
}

function wgs84ToGcj02(lng, lat) {
  if (outOfChina(lng, lat)) {
    return { lng, lat };
  }

  const a = 6378245.0;
  const ee = 0.00669342162296594323;
  let dLat = transformLat(lng - 105, lat - 35);
  let dLng = transformLng(lng - 105, lat - 35);
  const radLat = (lat / 180) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
  dLng = (dLng * 180) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);

  return { lng: lng + dLng, lat: lat + dLat };
}

function buildMapLink(keyword, lat, lng, radius = 3000) {
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    keyword,
    radius: String(radius),
    type: "1",
    key: "GXUST-AI-028",
    referer: "GXUST-AI-028"
  });

  return `https://mapapi.qq.com/web/mapComponents/locationCluster/v/index.html?${params.toString()}`;
}

function initializePage() {
  const foodData = window.LIUZHOU_FOOD_DATA;

  if (!foodData) {
    throw new Error("美食数据加载失败");
  }

  const elements = {
    resultContent: document.getElementById("result-content"),
    foodResult: document.getElementById("food-result"),
    foodDescription: document.getElementById("food-description"),
    resultShopLink: document.getElementById("result-shop-link"),
    resultShopText: document.getElementById("result-shop-text"),
    resultShopHint: document.getElementById("result-shop-hint"),
    resultKicker: document.getElementById("result-kicker"),
    resultTag: document.getElementById("result-tag"),
    pickButton: document.getElementById("pick-button"),
    pickButtonText: document.getElementById("pick-button-text"),
    shareButton: document.getElementById("share-button"),
    shareStatus: document.getElementById("share-status"),
    interactionHint: document.getElementById("interaction-hint"),
    foodList: document.getElementById("food-list"),
    poolCount: document.getElementById("pool-count"),
    locationPanel: document.getElementById("location-panel"),
    locationLabel: document.getElementById("location-label"),
    locationDetail: document.getElementById("location-detail"),
    locateButton: document.getElementById("locate-button"),
    locateButtonText: document.querySelector("#locate-button span"),
    districtSelect: document.getElementById("district-select"),
    mapLink: document.getElementById("map-link")
  };

  let picker;
  let chips = [];
  let currentPool = foodData.citywide.foods;
  let currentRegionLabel = foodData.citywide.label;
  let currentCoordinates = { ...LIUZHOU_CENTER };
  let boundaries = null;
  let boundariesPromise = null;
  let pickCount = 0;
  let currentSelection = null;
  let hasLiveLocation = false;
  let locationWatchId = null;
  let autoLocationAttempted = false;

  function loadBoundaries() {
    if (boundariesPromise) {
      return boundariesPromise;
    }

    boundariesPromise = fetch("liuzhou-boundaries.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("行政区边界加载失败");
        }
        return response.json();
      })
      .then((data) => {
        boundaries = data.features;
        return boundaries;
      })
      .catch((error) => {
        boundariesPromise = null;
        throw error;
      });

    return boundariesPromise;
  }

  function resetResult() {
    elements.foodResult.textContent = "还没想好？";
    elements.foodDescription.textContent = "点击下方按钮，让随机选择帮你做决定。";
    elements.resultKicker.textContent = `${currentRegionLabel} · 随机池`;
    elements.resultTag.textContent = "等待抽取";
    elements.pickButtonText.textContent = "帮我决定";
    elements.resultShopLink.hidden = true;
    elements.resultShopLink.href = "https://mapapi.qq.com/";
    elements.resultShopText.textContent = "在地图寻找附近店铺";
    elements.resultShopHint.textContent = "3公里内 · 距离优先";
    currentSelection = null;
    elements.interactionHint.textContent = `当前随机池共 ${currentPool.length} 种可选美食，不满意可以再抽一次。`;
    elements.shareStatus.textContent = "";
    pickCount = 0;
  }

  function updateMapLink(keyword, lat, lng) {
    elements.mapLink.href = buildMapLink(keyword, lat, lng);
  }

  function updateShopLink(foodName) {
    const originLabel = hasLiveLocation ? "当前位置" : "选区中心";
    elements.resultShopLink.href = buildMapLink(foodName, currentCoordinates.lat, currentCoordinates.lng, 3000);
    elements.resultShopLink.hidden = false;
    elements.resultShopLink.setAttribute("aria-label", `在腾讯地图搜索${originLabel}3公里内售卖${foodName}的店铺，按距离优先，新窗口打开`);
    elements.resultShopText.textContent = `在地图找卖「${foodName}」的店`;
    elements.resultShopHint.textContent = `${originLabel}3公里内 · 距离优先`;
  }

  function setPool(regionKey, regionLabel, coordinates) {
    const districtFoods = foodData.districts[regionKey];
    const localFoods = regionKey === "citywide"
      ? foodData.citywide.foods
      : districtFoods || foodData.citywide.foods;

    currentPool = mergeFoodPools(localFoods, foodData.common);
    currentRegionLabel = regionLabel;

    if (!hasLiveLocation) {
      currentCoordinates = coordinates || { ...LIUZHOU_CENTER };
    }

    picker = createFoodPicker(currentPool);
    pickCount = 0;

    elements.foodList.replaceChildren();
    chips = currentPool.map((food, index) => {
      const chip = document.createElement("span");
      chip.className = "food-chip";
      chip.textContent = food.name;
      chip.dataset.index = String(index);
      elements.foodList.appendChild(chip);
      return chip;
    });

    elements.poolCount.textContent = `${currentPool.length} 种可选美食`;
    resetResult();
    updateMapLink("美食", currentCoordinates.lat, currentCoordinates.lng);
  }

  function selectDistrict(value) {
    if (value === "citywide") {
      setPool("citywide", "柳州全市", LIUZHOU_CENTER);
      return;
    }

    const center = DISTRICT_CENTERS[value] || LIUZHOU_CENTER;
    setPool(value, `柳州市 · ${value}`, center);
  }

  function updateLocationView(state, title, detail) {
    elements.locationPanel.dataset.state = state;
    elements.locationLabel.textContent = title;
    elements.locationDetail.textContent = detail;
  }

  function setLocating(isLocating) {
    elements.locateButton.disabled = isLocating;
    elements.locateButtonText.textContent = isLocating ? "识别中…" : "重新定位";
  }

  function errorMessage(error) {
    if (!error) {
      return "定位失败，请手动选择所在城区。";
    }

    if (error.code === 1) {
      return "定位权限被拒绝，请在浏览器设置中允许定位，或在下方手动选择城区。";
    }

    if (error.code === 3) {
      return "定位超时，请到开阔位置重试，或在下方手动选择城区。";
    }

    return "暂时无法获取位置，请在下方手动选择城区。";
  }

  function startLocationWatch() {
    if (!navigator.geolocation.watchPosition || locationWatchId !== null) {
      return;
    }

    locationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const gcj = wgs84ToGcj02(position.coords.longitude, position.coords.latitude);
        currentCoordinates = { lat: gcj.lat, lng: gcj.lng };
        hasLiveLocation = true;

        if (currentSelection) {
          updateShopLink(currentSelection.name);
        }
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );
  }

  function locateUser() {
    if (!navigator.geolocation) {
      updateLocationView("error", "此浏览器不支持定位", "请在下方手动选择你所在的城区。");
      return;
    }

    setLocating(true);
    updateLocationView("loading", "正在识别所在城区…", "请允许浏览器获取位置，识别过程只在本机完成。");

    loadBoundaries()
      .then(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const gcj = wgs84ToGcj02(longitude, latitude);
            const district = findDistrictByPoint(boundaries, gcj.lng, gcj.lat);
            currentCoordinates = { lat: gcj.lat, lng: gcj.lng };
            hasLiveLocation = true;
            startLocationWatch();

            if (!district) {
              elements.districtSelect.value = "citywide";
              setPool("citywide", "柳州全市", currentCoordinates);

              if (currentSelection) {
                updateShopLink(currentSelection.name);
              }

              updateLocationView(
                "outside",
                "当前位置不在柳州市",
                "已切换为柳州全市精选池，也可以在下方手动选择要去的城区。"
              );
              setLocating(false);
              return;
            }

            elements.districtSelect.value = district.name;
            setPool(district.name, `柳州市 · ${district.name}`, currentCoordinates);

            if (currentSelection) {
              updateShopLink(currentSelection.name);
            }

            updateLocationView(
              "success",
              `当前位置：柳州市 · ${district.name}`,
              `定位精度约 ${Math.round(accuracy)} 米 · 仅在本机识别，不上传位置。`
            );
            setLocating(false);
          },
          (error) => {
            updateLocationView("error", "未能获取当前位置", errorMessage(error));
            setLocating(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 60000
          }
        );
      })
      .catch(() => {
        updateLocationView("error", "行政区数据加载失败", "定位暂不可用，请在下方手动选择城区。");
        setLocating(false);
      });
  }

  function autoLocateIfGranted() {
    if (!navigator.geolocation || !navigator.permissions) {
      return;
    }

    navigator.permissions.query({ name: "geolocation" })
      .then((status) => {
        if (status.state === "granted") {
          autoLocationAttempted = true;
          locateUser();
        }
      })
      .catch(() => {});
  }

  elements.locateButton.addEventListener("click", locateUser);

  elements.districtSelect.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    selectDistrict(selectedValue);

    if (selectedValue === "citywide") {
      updateLocationView("manual", "已选择：柳州全市", "将使用柳州各县区的代表性美食随机池。");
      return;
    }

    updateLocationView("manual", `已选择：柳州市 · ${selectedValue}`, "将使用该城区的本地特色美食随机池。");
  });

  elements.pickButton.addEventListener("click", () => {
    const selection = picker.pick();
    pickCount += 1;
    currentSelection = selection;

    elements.foodResult.textContent = selection.name;
    elements.foodDescription.textContent = selection.description;
    elements.resultTag.textContent = selection.tag || "柳州特色";
    updateShopLink(selection.name);
    elements.pickButtonText.textContent = "再抽一次";
    elements.interactionHint.textContent = `已为你选中“${selection.name}”，不满意可以再抽一次。`;
    elements.shareStatus.textContent = "";

    if (!hasLiveLocation && !autoLocationAttempted) {
      autoLocationAttempted = true;
      locateUser();
    }

    chips.forEach((chip, index) => {
      chip.classList.toggle("is-selected", index === selection.index);
    });

    elements.resultContent.classList.remove("is-changing");
    void elements.resultContent.offsetWidth;
    elements.resultContent.classList.add("is-changing");
  });

  async function copyCurrentLink() {
    const url = window.location.href;

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (!copied) {
      throw new Error("复制失败");
    }
  }

  elements.shareButton.addEventListener("click", async () => {
    const shareData = {
      title: "柳州今天吃什么",
      text: "识别你在柳州的城区，随机决定下一餐。",
      url: window.location.href
    };

    elements.shareStatus.textContent = "";

    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share(shareData);
        elements.shareStatus.textContent = "分享完成，感谢你把小工具推荐给朋友。";
      } catch (error) {
        if (error.name !== "AbortError") {
          elements.shareStatus.textContent = "暂时无法调起分享，请复制浏览器地址进行分享。";
        }
      }
      return;
    }

    try {
      await copyCurrentLink();
      elements.shareStatus.textContent = "链接已复制，可以粘贴到社交平台分享。";
    } catch (error) {
      elements.shareStatus.textContent = "请复制浏览器地址，粘贴到社交平台分享。";
    }
  });

  setPool("citywide", "柳州全市", LIUZHOU_CENTER);
  loadBoundaries().catch(() => {
    updateLocationView("error", "行政区数据暂不可用", "自动定位暂不可用，可手动选择城区；其余功能不受影响。");
  });
  autoLocateIfGranted();

  window.addEventListener("pagehide", () => {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId);
      locationWatchId = null;
    }
  });
}

if (typeof document !== "undefined") {
  initializePage();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createFoodPicker,
    mergeFoodPools,
    pointInPolygon,
    findDistrictByPoint,
    wgs84ToGcj02,
    buildMapLink
  };
}
