import {StyleSheet} from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  contentHeader: {
    paddingEnd: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderContent: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  slider: {
    height: Utils.scaleWithPixel(135),
    width: '100%',
    borderRadius: 10,
  },
  sliderTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  contentSliderRate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagRate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contentSearch: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  lineForm: {
    width: 1,
    height: '100%',
    margin: 10,
  },
  imageContent: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContent: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  notificationContent: {
    width: 20,
    height: 20,
  },
  doc: {
    width: 10,
    height: 10,
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  menuIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    height: Utils.scaleWithPixel(120),
    width: '100%',
    borderRadius: 10,
  },
  contentBannerTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  bannerButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  logo: {
    width: 120,
    height: 40,
    marginLeft:5
  },
});
