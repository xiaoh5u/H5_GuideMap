import 'ol/ol.css';
import { Feature, View, Overlay } from 'ol';
import Map from 'ol/Map';
import { Point } from 'ol/geom';
import { Icon, Stroke, Style, Fill, Text, Circle as CircleStyle } from 'ol/style';
import { defaults as defaultInteractions } from 'ol/interaction';
import { OSM, XYZ, Vector as VectorSource, Cluster } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { transformExtent, fromLonLat, transform } from 'ol/proj';
import { reactive, ref, toRefs, defineComponent } from 'vue';
import { GetSpots, GetDistinguishPoleData, getSpotInfoById } from '@/request/api/guide.js';
import { onMounted, onBeforeMount, getCurrentInstance } from 'vue';
import { Toast } from 'vant';
import AsideMenu from '@/components/AsideMenu';
import OverlayComponent from '@/components/Overlay';
import PopUpComponent from '@/components/PopUp';

export default {
  components: { AsideMenu, OverlayComponent, PopUpComponent },
  setup() {
    const data = reactive({
      map: null,
      pointSource: [],
      deviceSource: [],
      pointFeatures: [],
      vectorSource: null,
      show: true,
      popup_overlay: [],
      currentSpot: {},
    });
    //获取地图资源数据
    const getMapResource = async () => {
      let toast = Toast.loading({
        message: '数据加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });

      const params = { pageRows: 99, pageIndex: 1, Type: 0 };
      //获取景区资源
      await GetSpots(params).then(res => {
        data.pointSource = res.Data.Rows;
      });
      //获取设备资源
      GetDistinguishPoleData().then(device => {
        toast.clear();
        data.deviceSource = device.Data;
        mapInit();
      });
      console.log(data);
    };

    //地图开图方法
    const mapInit = () => {
      let mapExtent = transformExtent([119.598468, 26.020195, 119.628231, 26.048223], 'EPSG:4326', 'EPSG:3857');
      let mapMinZoom = 13;
      let mapMaxZoom = 18;
      let layer = new TileLayer({
        extent: mapExtent,
        source: new XYZ({
          url: `https://www.cjssy.cn:20013/map/{z}/{x}/{y}.png`,
          tilePixelRatio: 1.0,
          minZoom: mapMinZoom,
          maxZoom: mapMaxZoom,
        }),
      });

      data.map = new Map({
        target: 'map',
        layers: [layer],
        view: new View({
          extent: mapExtent,
          center: fromLonLat([119.6132719921875, 26.028722070697015]),
          zoom: 15,
          minZoom: mapMinZoom,
          maxZoom: mapMaxZoom,
        }),
        interactions: defaultInteractions({
          pinchRotate: false, // 移动端禁止地图旋转
        }),
      });
      createSpotLayer();
      createDeviceLayer;
      setPupup();
      handleMapClick();
    };

    //初始化景点信息
    const createSpotLayer = () => {
      // 创建Feature对象集合
      let features = new Array();
      for (let i = 0; i < data.pointSource.length; i++) {
        const item = data.pointSource[i];
        const coord = transform([item.Longitude, item.Latitude], 'EPSG:4326', 'EPSG:3857');
        let feature = new Feature({
          geometry: new Point(coord),
        });
        feature.set('data', item);
        //push所有的Feature
        data.pointFeatures.push(feature);

        if (item.Type === 1 || !item.Type) {
          features.push(feature);
        }
      }

      // 矢量要素数据源
      data.vectorSource = new VectorSource({
        features: features,
      });

      // 聚合标注数据源
      let clusterSource = new Cluster({
        distance: 30, //这个是通过 distance 来控制两个点聚合的间距
        source: data.vectorSource,
      });

      let vectLayer = new VectorLayer({
        source: clusterSource,
        style: function(feature, resolution) {
          const data = feature.values_.features[0].values_.data;
          let src = null;
          if (data.Type) {
            switch (data.Type) {
              case 1:
                src = require('@/assets/h5/景点.png');
                return style1(src);
              case 2:
                src = require('@/assets/h5/游客中心.png');
                return style2(src);
              case 3:
                src = require('@/assets/h5/厕所.png');
                return style2(src);
              case 4:
                src = require('@/assets/h5/停车场.png');
                return style2(src);
              case 5:
                src = require('@/assets/h5/导航.png');
                return style2(src);
            }
          }

          function style1(src) {
            return [
              new Style({
                image: new Icon({
                  //可以使用图片资源
                  anchor: [0.5, 0.5], //锚。默认值是图标中心 默认值是[0.5,0.5]
                  anchorOrigin: 'top-left', //锚的原点:左下角、右下角、左上方或右上方。默认是左上
                  offset: [0, 0], //偏移值,默认为[0,0]
                  offsetOrigin: 'top-left', //偏移量的原点,bottom-left, bottom-right, top-left or top-right. 默认是`top-left`
                  opacity: 1, //默认是1  （0,1）
                  scale: 0.45, //默认是1
                  rotation: 0, //以弧度旋转(顺时针方向正旋转) 默认为0
                  // size:,//图标大小(以像素为单位)。可与偏移量一起用于定义要从原点(sprite)图标图像使用的子矩形
                  // src: 'https://ae01.alicdn.com/kf/Ua13426dc68ad4f309d90d75a28efbfe5U.jpg',//图像URL源
                  src,
                  // rotateWithView：false,//是否旋转视图中的图标  默认为false
                }),
                text: new Text({
                  //文字
                  font: '2px',
                  text: data.ChineseName, //文本内容
                  textAlign: 'left', //文本对齐 'left', 'right', 'center', 'end' 'start'.针对于placement: 'point',默认为'center'；针对于placement: 'line'，默认是让渲染器选择不超过maxAngle的位置
                  padding: [5, 5, 5, 5],
                  fill: new Fill({ color: '#fff' }), //如果未设置，默认未#333
                  // stroke: new Stroke({ color: '#fff' }),
                  offsetX: -17, //水平文本偏移量(以像素为单位)。正值将把文本右移。默认0
                  offsetY: -40, //垂直文本偏移量(以像素为单位)。正值会将文本向下移动。默认0
                  rotateWithView: true,
                  //标签的边框
                  backgroundStroke: new Stroke({
                    color: '#fff',
                    width: 2,
                  }),
                  //标签的背景填充
                  backgroundFill: new Fill({
                    color: '#3886f0',
                  }),
                }),
              }),
            ];
          }

          function style2(src) {
            return [
              new Style({
                image: new Icon({
                  //可以使用图片资源
                  anchor: [0.5, 0.5], //锚。默认值是图标中心 默认值是[0.5,0.5]
                  anchorOrigin: 'top-left', //锚的原点:左下角、右下角、左上方或右上方。默认是左上
                  offset: [0, 0], //偏移值,默认为[0,0]
                  offsetOrigin: 'top-left', //偏移量的原点,bottom-left, bottom-right, top-left or top-right. 默认是`top-left`
                  opacity: 1, //默认是1  （0,1）
                  scale: 0.45, //默认是1
                  rotation: 0, //以弧度旋转(顺时针方向正旋转) 默认为0
                  // size:,//图标大小(以像素为单位)。可与偏移量一起用于定义要从原点(sprite)图标图像使用的子矩形
                  src: src, //图像URL源
                  // rotateWithView：false,//是否旋转视图中的图标  默认为false
                }),
              }),
            ];
          }
        },
        zIndex: 999,
      });
      data.map.addLayer(vectLayer);
    };

    //创建设备图层
    const createDeviceLayer = () => {
      let features = new Array();
      for (let i = 0; i < data.deviceSource.length; i++) {
        const item = data.deviceSource[i];
        const coord = transform([item.Longitude, item.Latitude], 'EPSG:4326', 'EPSG:3857');
        let feature = new Feature({
          geometry: new Point(coord),
        });
        feature.set('data', item);
        features.push(feature);
      }

      // 矢量要素数据源
      const vectorSource = new VectorSource({
        features: features,
      });

      let vectLayer = new VectorLayer({
        source: vectorSource,
        style: function(feature, resolution) {
          const data = feature.values_.data;
          let src = null;
          switch (data.IsScreen) {
            case true:
              src = require(`@/assets/h5/大屏_line.png`);
              return styleFuc(src);
            default:
              src = require(`@/assets/h5/打卡杆_line.png`);
              return styleFuc(src);
          }
          function styleFuc(src) {
            return [
              new Style({
                image: new Icon({
                  //可以使用图片资源
                  anchor: [0.5, 1], //锚。默认值是图标中心 默认值是[0.5,0.5]
                  anchorOrigin: 'top-left', //锚的原点:左下角、右下角、左上方或右上方。默认是左上
                  offset: [0, 0], //偏移值,默认为[0,0]
                  offsetOrigin: 'top-left', //偏移量的原点,bottom-left, bottom-right, top-left or top-right. 默认是`top-left`
                  opacity: 1, //默认是1  （0,1）
                  scale: 1, //默认是1
                  rotation: 0, //以弧度旋转(顺时针方向正旋转) 默认为0
                  src: src, //图像URL源
                }),
              }),
            ];
          }
        },
        zIndex: 998,
      });
      data.map.addLayer(vectLayer);
    };

    //设置点击弹窗
    const setPupup = () => {
      const popup_div = document.querySelector('#wrapper');
      const pop_closer = document.querySelector('.popup-close-button');
      data.popup_overlay = new Overlay({
        element: popup_div,
        // positioning:'bottom-center',
        offset: [-101, -284],
      });

      //close方法
      pop_closer.onclick = () => {
        data.popup_overlay.setPosition(undefined);
        pop_closer.blur();
        data.map.getView().animate({
          duration: 500,
          zoom: 17,
        });
        return false;
      };

      data.map.addOverlay(data.popup_overlay);
    };

    //地图点击事件
    const handleMapClick = () => {
      data.map.on('click', event => {
        const pixel = data.map.getEventPixel(event.originalEvent);
        const feature = data.map.forEachFeatureAtPixel(pixel, function(feature) {
          return feature;
        });
        //点击的是元素
        if (feature) {
          if (feature.values_.features) {
            //聚类图层 即景点设施图层
            const results = feature.values_.features[0].values_;
            const resource = results.data;
            if (resource.Type === 1) {
              getSpotInfoById({ id: resource.Id }).then(res => {
                data.currentSpot = res.Data;
              });
            } else {
              data.currentSpot = {
                ImageUrl: resource.ImageUrl,
                ScenicSpotName: resource.ChineseName,
                Longitude: resource.Longitude,
                Latitude: resource.Latitude,
              };
            }
            const coord = results.geometry.getCoordinates();
            data.popup_overlay.setPosition(coord);
            data.map.getView().animate({
              duration: 500,
              center: coord,
              zoom: 18,
            });
          }
        } else {
          data.popup_overlay.setPosition(undefined);
        }
      });
    };

    //右侧菜单点击事件
    const handleMenuClick = id => {
      data.vectorSource.clear();
      data.popup_overlay.setPosition(undefined);
      data.pointFeatures.forEach(event => {
        const type = event.values_.data.Type;
        if (type == id) {
          data.vectorSource.addFeature(event);
        }
      });
      data.map.getView().animate({
        duration: 500,
        zoom: 15.1,
      });
    };

    getMapResource();

    return { ...toRefs(data), handleMenuClick };
  },
};
