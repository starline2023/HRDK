/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-new-object */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  PermissionsAndroid,
  Image,
  NativeAppEventEmitter,
  TouchableWithoutFeedback,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import NetInfo from '@react-native-community/netinfo';
import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
import LinearGradient from 'react-native-linear-gradient';
import CustumProgress from '../UtilityClass/CustumProgress';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePlaceholder from 'react-native-image-placeholder';
import MarqueeTop from '../UtilityClass/MarqueeTop';
import MarqueeBottom from '../UtilityClass/MarqueeBottom';
import { SafeAreaView } from 'react-navigation';
let deviceWidth = Dimensions.get('window').width;

let Window = Dimensions.get('window');

export default class JewelleryScreen extends React.Component {
  constructor(props) {
    super(props);

    console.warn();
    console.disableYellowBox = true;
    this.images=[];
    this.ArtNo=[];
    this.state = {
      isLoging: true,
      isProgress:false,
      NewsData: '',
      CategoryData: '',
      CatID:0,
      Marque: '',
      Marque_Bottom: '',
      isModalVisible:false,
      selectedImage:'',
      itemPage:1,
      webPageCount:0,
      islodinMore:false,
      subCatID:'',
      isNew: false,
    };
  }
componentDidMount() {
  
  this.handleEvent();
    this.eventListener = NativeAppEventEmitter.addListener('eventKey', params =>
      this.handleEvent(params),
    );

    // const {params} = this.props.navigation.state;
    // this.setState({subCatID:params.productID});
    // this.setState({isNew:params.isNewCat});
    this.getSurfaces();
    this.handleLoadMore('0');

    // if (this.state.isNew) {
    //   this.setState({
    //     NewsData:[],
    //     itemPage:1,
    //     webPageCount:0,        
    //   });
    // }

    NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        //this.getSurfaces();
      }
    });
  }

  componentWillReceiveProps(newProps) {
    // const {params} = newProps.navigation.state;
    // this.setState({subCatID:params.productID});
    // this.setState({isNew:params.isNewCat});
    this.setState({isLoging:true});
    
  //   setTimeout( () => {
  //     this.setTimePassed();
  //  },500);

    // this.setState({ NewsData:[] });
    // this.setState({ itemPage:1 });
    // this.setState({ webPageCount:0 });

    // this.setState({
    //   NewsData:[],
    //   itemPage:1,
    //   webPageCount:0,        
    // });

    // this.handleLoadMore(params.productID);

    // if (this.state.isNew) {
      
    // }
  }

  setTimePassed() {
    this.setState({ NewsData:[] });
    this.setState({ itemPage:1 });
    this.setState({ webPageCount:0 });

    this.handleLoadMore('0');
 }

 componentWillUnmount() {
  //remove listener
  this.eventListener.remove();
}

handleEvent = () => {
  let C_Detaild = GLOBALS.ContactDetail;

  if (C_Detaild != '') {
    this.setState({Marque: C_Detaild.Marquee});
    this.setState({Marque_Bottom: C_Detaild.Marquee2});     
  }
}

getSurfaces() {
  fetch(GLOBALS.BASE_URL + 'GetCategoryImage', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
    }),
    body: JSON.stringify({
      CleintId: GLOBALS.ClientID,
    }),
  })
    .then(response => response.json())
    .then(responseJson => {
      try {
        let obj = new Object();
        console.log('CategoryDataCat.d',responseJson.d);
        if (responseJson.d != '') {
          obj = JSON.parse(responseJson.d);
        }

        var allCat = [{
              CleintId: GLOBALS.ClientID,
              C_ID: '0',
              C_Name: 'ALL',
            }]

        this.setState({
          // isLoading: false,            
          CategoryData: [
            ...allCat,
            ...Object.values(obj)
        ],
        // CatID: obj[0].C_ID,
        });
        // this.setState({CatID: this.state.CategoryData[1].C_ID});

      } catch (error) {
        this.setState({
          // isLoading: false,    
          CategoryData: [],
        });
      }
    })
    .catch(error => {
      console.error(error);
      this.setState({
        // isLoading: false,    
        CategoryData: [],
      });
    });
}

  handleLoadMore = (SC_ID) => {
    console.log('web-------------- ' + this.state.webPageCount);
    console.log('itemPage------------- ' + this.state.itemPage);

    if (this.state.NewsData.length > 0) {
      this.setState({islodinMore: true});
    }
     
    fetch(GLOBALS.BASE_URL + 'GetJewelleryByCategoryWeb', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: JSON.stringify({
        CleintId: GLOBALS.ClientID,
        pageNO: this.state.itemPage,
        C_ID: SC_ID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          console.log('responseJson.d'+responseJson.d);
          let obj = new Object();
          if (responseJson.d != '') {
            obj = JSON.parse(responseJson.d);
          
            if (obj.length > 0) {
              this.setState({
                  NewsData: [
                    ...this.state.NewsData,
                    ...Object.values(obj)
                  ],
                  webPageCount:obj[0].PageCount+1
              });
              if (this.state.webPageCount != this.state.itemPage) {
                this.setState({itemPage: this.state.itemPage + 1});
              }               
            }          
          }          
                    
          this.setState({
            isLoging: false,
            isProgress:false,
            islodinMore: false,
          });

        } catch (error) {
          console.error(error);
          this.setState({
            isLoging: false,
            isProgress:false,
            islodinMore: false,
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          isLoging: false,
          isProgress:false,
          islodinMore: false,
         });
    });
};

   GetGridViewItem = (item,index) => {
     
     this.setState({ 
        isModalVisible: true,
        selectedImage: index,
      });
  }

  GetCategoryItem(item) {
    console.log('ClickCategory',item);

    if (this.state.isProgress == true) {  
      return;    
    } else {
      setTimeout( () => {
        this.setTimePassed(item);
     },100);
  
      this.setState({
        isLoading:true,
        isProgress:true,
      });
    }
  }

  setTimePassed(item) {
    this.setState({
      // isLoading:true,
      NewsData: [],
      itemPage:1,
      webPageCount:0,
      islodinMore:false,
      CatID:item.C_ID,      
    });
    this.handleLoadMore(item.C_ID);
  }

  renderCategoryItemGrid(data) {
    let {item, index} = data;
    
    var count = item.C_Count;
    if (item.C_Name == 'ALL') {
      count='';
    } else {
      count=' (' + count + ')';
    }
    return (
      <TouchableWithoutFeedback onPress={this.GetCategoryItem.bind(this, item)}>
        <View style={[styles.itemRowCategoryGrid,{backgroundColor:item.C_ID == this.state.CatID ? GLOBALS.COLOR.THEAMCOLOR : GLOBALS.COLOR.WHITE,borderColor:item.C_ID == this.state.CatID ? GLOBALS.COLOR.TRANSPARENT_COLOR : GLOBALS.COLOR.THEAMCOLOR,borderWidth:0.8}]}>
          <Text style={{color:item.C_ID == this.state.CatID ? GLOBALS.COLOR.WHITE : GLOBALS.COLOR.BLACK,marginHorizontal:15,justifyContent: 'center',alignContent: 'center',alignItems: 'center',textAlign:'center',fontWeight:'bold'}}>{item.C_Name + count}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _renderItem = ({item,index}) => (

        <TouchableOpacity onPress={this.GetGridViewItem.bind(this,item,index)}>

          <View style={styles.itemRowGrid}>
          <View style={styles.itemRowGridSub}>
          
            <ImagePlaceholder
                    style={{width: '100%',height: '83%',borderWidth:0.2,borderColor:GLOBALS.COLOR.YELLOW}}
                    placeholderSource={require('../Images/OtrLogo.png')}
                    placeholderStyle={{resizeMode: 'contain',width:80,height:80,tintColor:'rgba(0,0,0,0.2)'}}
                    loadingStyle={{ size: 30 , color: GLOBALS.COLOR.ProgressFillColor,unfilledColor: GLOBALS.COLOR.ProgressUnfilledColor }}
                    source={{ uri: item.Image}}
                    resizeMode={'contain'}
                />
            <View
              style={{
                flex: 1,
                backgroundColor:GLOBALS.COLOR.THEAMCOLOR,
                height: '17%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 2,
                borderTopColor:GLOBALS.COLOR.YELLOW,
                borderTopWidth:0.5,
              }}>
              <Text numberOfLines={2} style={{color:GLOBALS.COLOR.WHITE,fontSize:13,fontWeight:'700',textAlign:'center'}}>{item.Description}</Text>
            </View>
            <View
              style={{
                // flex: 1,
                position:'absolute',
                backgroundColor:'rgba(223, 184, 88, 0.5)',
                height: 30,
                width:'100%',
                // opacity:0.7,
                alignItems: 'center',
                justifyContent: 'center',
                // paddingHorizontal: 2,
                // borderTopColor:GLOBALS.COLOR.YELLOW,
                // borderTopWidth:0.5,
              }}>
              <Text numberOfLines={1} style={{color:GLOBALS.COLOR.BLACK,fontSize:13,fontWeight:'700',textAlign:'center'}}>{item.ArtNo}</Text>
            </View>
          </View>
        </View>
        </TouchableOpacity>
   );
   

  render() {
    
    if (this.state.NewsData.length > 0) {
        this.images = this.state.NewsData.map(item => (
          {url: item.Image}          
       ));
    }

    if (this.state.NewsData.length > 0) {
      this.ArtNo = this.state.NewsData.map(item => (
        {ArtNo: item.ArtNo}          
     ));
  }
    
    if (this.state.isLoging) {
      return <CustumProgress />;
    } else {
      return (
        <View style={{flex:1}}>
          <MarqueeTop />
        <View style={styles.container}>

        <View style={{margin:8,shadowColor: GLOBALS.COLOR.BLACK,shadowColor: 'darkgray',shadowOpacity: 0.8,shadowRadius: 5,shadowOffset: {height: 0, width: 2},elevation: 5,}}>
              <FlatList  
                style={{height:30}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.CategoryData}  
                renderItem={this.renderCategoryItemGrid.bind(this)}
              /> 
            </View>  

            {this.state.isProgress == true ? (
              <CustumProgress />
          ) : (

          this.state.NewsData == 0  ? <View style={[{flex: 1,justifyContent:'center'}]}>
              <Text style={[{alignContent:'center',alignItems:'center',textAlign:'center',color:GLOBALS.COLOR.BLACK,fontSize:15,fontWeight: 'bold'}]}>Product Not Available</Text>
            </View> :

          <FlatList           
            data={this.state.NewsData}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent=
            {this.state.webPageCount != this.state.itemPage ?
              <TouchableOpacity
                style={{
                  flex: 1,height:40,width:'100%',justifyContent: 'center',    
                  }}
                activeOpacity={1}
                onPress={() => {
                  this.handleLoadMore(this.state.CatID);
                }}>
                <Text style={{fontSize: 17,
                  fontWeight:'bold',
                  justifyContent: 'center',                                                                                                
                  alignItems: 'center',
                  textAlign: 'center',
                  color:GLOBALS.COLOR.BLACK,
                  width:'100%'}}>More items</Text></TouchableOpacity> : null}

            onEndReachedThreshold={200}
            onEndThreshold={0}
            legacyImplementation={true}
            numColumns={2} />
        )}

            {this.state.islodinMore ? <View style={{position: 'absolute',flex:1,alignItems: 'center',
                alignContent: 'center',
                alignSelf:'center',height:"100%"}}><CustumProgress />
              </View> : null}
            </View>

            
            {this.images.length >0 ? <Modal visible={this.state.isModalVisible} transparent={true} onRequestClose={()=> this.setState({isModalVisible:false})}>
                  <View style={[{flex:1,justifyContent:'center',backgroundColor:GLOBALS.COLOR.WHITE}]}>
                    <ImageViewer 
                      backgroundColor={'white'}
                      imageUrls={this.images}
                      onClick={()=> this.setState({isModalVisible:false})}
                      loadingRender={() => <ActivityIndicator size="large" color="#000" />}
                      enableImageZoom={true}
                      saveToLocalByLongPress={false}
                      index={this.state.selectedImage}                      
                      renderFooter={(index) => 
                        <View style={[{width: deviceWidth,backgroundColor:GLOBALS.COLOR.THEAMCOLOR,alignItems:'center',justifyContent:'center',alignSelf:'center',alignContent:'center'}]}>
                          <Text style={{flex:1,color:GLOBALS.COLOR.YELLOW,fontSize:18,fontWeight:'700',textAlign:'center',marginVertical:10}}>{this.state.NewsData[index].ArtNo}</Text>
                          <Text style={{flex:1,color:GLOBALS.COLOR.WHITE,fontSize:13,fontWeight:'700',textAlign:'center',marginBottom:10,marginHorizontal:10}}>{this.state.NewsData[index].Description}</Text>
                      </View>
                      }
                    />                    
               </View>
            </Modal>: null}
            <MarqueeBottom />
        </View>
      );
    }
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:4,
    backgroundColor: GLOBALS.COLOR.WHITE,
  },
  itemContainer: {
    width: Window.width/2-12,
    height: Window.width/2.,
    margin: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'gray',
    shadowOpacity: 1,
    elevation: 2,
    // background color must be set
    backgroundColor : "#f5f5f5" // invisible color
  },
  item: {
    flex: 1,
    margin: 4,
    backgroundColor: 'lightblue',
  },
  ///////Grid/////
  itemRowGrid: {
    justifyContent: 'center',
    width: Window.width / 2 - 5,
    alignItems: 'center',
    marginBottom:12,
    backgroundColor: 'transparent',
  },
  itemRowGridSub: {
    width: Window.width / 2 - 15,
    // marginTop: 8,
    backgroundColor: GLOBALS.COLOR.WHITE,
    height: Window.width / 2 + 25,
    shadowColor: 'gray',
    borderColor:GLOBALS.COLOR.THEAMCOLOR,
    borderWidth: 0.5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation:4,
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
  itemRowCategoryGrid: {
    flex:1,
    justifyContent: 'center',
    marginHorizontal:5,
    borderRadius:20,
    alignItems: 'center',
    backgroundColor: GLOBALS.COLOR.THEAMCOLOR,

    // shadowColor: GLOBALS.COLOR.BLACK,
    // shadowOpacity: 0.2,
    // shadowRadius: 2.0,
    // shadowOffset: {height: 0, width: 0},
    // elevation: 2,
  },
});
