import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  headerStyle: {
    height: 'auto',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImageStyle: {
    height: 250,
    width: '100%',
    top: 0,
    alignSelf: 'center',
    position: 'absolute',
    paddingBottom: 20,
  },
  iconContent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColor.dividerColor,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  icon: {
    width: 18,
    height: 18,
  },
  calendarIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: BaseColor.fieldColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtn: {
    height: 28,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  lineSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentRate: {
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
  line: {
    height: 0.5,
    backgroundColor: BaseColor.dividerColor,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 5,
  },
  tagIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
